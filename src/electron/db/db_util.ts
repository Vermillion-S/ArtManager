import { app } from 'electron';
import path from "path";

import Database from "better-sqlite3";
import { Z_UNKNOWN } from 'zlib';

class AppDatabase {
    private db;

    public constructor() {
        const dbPath = path.join(app.getPath('userData'), 'scheduleDB.db');
        this.db = new Database(dbPath);
        this.db.pragma('journal_mode = WAL');
        this.setUpDatabase();
    }

    // Db Managment

    setUpDatabase() {
        this.db.pragma('foreign_keys = ON');

        this.db.exec(`
            CREATE TABLE IF NOT EXISTS Schedules (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                startDate TEXT NOT NULL,
                recurrence INTEGER NOT NULL,
                Sunday INTEGER NOT NULL,
                Monday INTEGER NOT NULL,
                Tuesday INTEGER NOT NULL,
                Wednesday INTEGER NOT NULL,
                Thursday INTEGER NOT NULL,
                Friday INTEGER NOT NULL,
                Saturday INTEGER NOT NULL,
                Deleted INTEGER NOT NULL DEFAULT 0
            ) STRICT;
        `);
        this.db.exec(`
            CREATE TABLE IF NOT EXISTS Images (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                type TEXT NOT NULL,
                path TEXT NOT NULL
            ) STRICT;
        `);
        this.db.exec(`
            CREATE TABLE IF NOT EXISTS Image_Tags (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                ImageID INTEGER NOT NULL,
                tag TEXT NOT NULL,
                FOREIGN KEY (ImageID) REFERENCES Images(id)
            ) STRICT;
        `);
        this.db.exec(`
            CREATE TABLE IF NOT EXISTS Submissions (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                ImageID INTEGER,
                FOREIGN KEY (ImageID) REFERENCES Images(id)
            ) STRICT;
        `);
        this.db.exec(`
            CREATE TABLE IF NOT EXISTS Assignments (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                ScheduleID INTEGER NOT NULL,
                CategoryTag TEXT NOT NULL,
                DueDate TEXT,
                SubmissionID INTEGER,
                FOREIGN KEY (ScheduleID) REFERENCES Schedules(id),
                FOREIGN KEY (SubmissionID) REFERENCES Submissions(id)
            ) STRICT;
        `);
        this.db.exec(`
            CREATE TABLE IF NOT EXISTS Exercises (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                ExerciseTag TEXT NOT NULL,
                CategoryTag TEXT NOT NULL
            ) STRICT;
        `);
    }

    public createNewSchedule(schedule: Schedule): number {
        const stmt = this.db.prepare(
            'INSERT INTO Schedules (startDate, recurrence, Sunday, Monday, Tuesday, Wednesday, Thursday, Friday, Saturday) VALUES (@startDate, @recurrence, @Active.Sunday, @Active.Monday, @Active.Tuesday, @Active.Wednesday, @Active.Thursday, @Active.Friday, @Active.Saturday)'
        );
        // Named params must all be present on the object (use null, not undefined)
        return Number(stmt.run(schedule).lastInsertRowid);
    }

    public createNewAssignment(assignment: Assignment): number {
        const stmt = this.db.prepare(
            'INSERT INTO Assignments (ScheduleID, CategoryTag, DueDate, SubmissionID) VALUES (@ScheduleID, @CategoryTag, @DueDate, @SubmissionID)'
        );
        // Named params must all be present on the object (use null, not undefined)
        return Number(stmt.run(assignment).lastInsertRowid);
    }

    public deleteSchedule(scheduleID: number) {
        this.db.prepare('UPDATE Schedules SET Deleted = 1 WHERE id = ?').run(scheduleID);
    }

    public submitImage(image: Image, imageTags: string[] | null): number {
        
        // Prepared insertion statements
        const insertImage = this.db.prepare('INSERT INTO Images (type, path) VALUES (@type, @path)');
        const insertTag = this.db.prepare('INSERT INTO Image_Tags (ImageID, tag) VALUES (?, ?)');

        const run = this.db.transaction((img: Image, tags: string[] | null) => {
            const id = Number(insertImage.run(img).lastInsertRowid);
            for (const tag of tags ?? []) insertTag.run(id, tag);
            return id;
        });

        return run(image, imageTags);
    }

    public submitAssignment(assignmentID: number, submissionID: number) {
        this.db.prepare('UPDATE Assignments SET SubmissionID = ? WHERE id = ?')
            .run(submissionID, assignmentID);
    }   

    public submitPost() {
        return;
    }

    public close() {
        this.db.close();
    }

    // Queries

    public getExerciseReferences(exercise : Exercise): Image[] {
        
        return this.getImagesbyTag(exercise.exerciseTag);
        
    }

    public checkActiveAssignments() : Assignment[] {
        const stmt = this.db.prepare("SELECT * FROM Assignments WHERE SubmissionID IS NULL");
        let assignments = stmt.all() as { id: number; ScheduleID: number; CategoryTag: string; DueDate: string; SubmissionID: number | null }[] | undefined;
        if (assignments === undefined) {
            console.log("No entries match");
            return [];
        }
        return assignments.map((assignment: any) => ({
            id: assignment.id,
            scheduleID: assignment.ScheduleID,
            categoryTag: assignment.CategoryTag,
            dueDate: assignment.DueDate,
            submissionID: assignment.SubmissionID
        }));
    }

    public getScheduleSubmissions(schedule : Schedule) : Submission[] {
        const stmt = this.db.prepare("SELECT * FROM Submissions WHERE (SELECT * FROM Assignments WHERE ScheduleID = ?)");
        let ScheduleSubmissions = stmt.all(schedule.id) as { id: number; dateSubmitted: string; ImageID: number }[] | undefined;
        if (ScheduleSubmissions === undefined) {
            console.log("No entries match");
            return [];
        }
        return ScheduleSubmissions.map((submission: any) => ({
            id: submission.id,
            dateSubmitted: submission.dateSubmitted,
            imageID: submission.ImageID
        }));
    }

    public getImagebyID(imageID : number) : Image | undefined {
        const stmt = this.db.prepare("SELECT * FROM Images WHERE id = ?");
        const image = stmt.get(imageID) as { id: number; type: string; path: string } | undefined;
        if (image === undefined || image === null) {
            console.log("No entries match");
            return;
        }
        return {
            id: image.id,
            type: image.type,
            path: image.path,
            tags: this.getImageTags({id: image.id, type: image.type, path: image.path, tags: []}) ?? []
        };
    }

    public getImagesbyTag(tag : string) : Image[] {
        const stmt = this.db.prepare("SELECT * FROM images JOIN Image_Tags ON images.id = Image_Tags.ImageID WHERE Image_Tags.tag = ?");
        let filterecImages = stmt.all(tag) as { id: number; type: string; path: string }[] | undefined;
        if (filterecImages === undefined) {
            console.log("No entries match");
            return [];
        }
        return filterecImages.map((image: any) => ({
            id: image.id,
            type: image.type,
            path: image.path,
            tags: this.getImageTags({id: image.id, type: image.type, path: image.path, tags: []}) ?? []
        }));
    }

    public getImageTags(image : Image) : string[] | undefined {
        const stmt = this.db.prepare("SELECT tag from Image_Tags WHERE ImageID = ?")
        let tags = stmt.all(image.id) as { tag: string }[] | undefined;
        if (tags === undefined) {
            console.log("No entries match");
            return;
        }
        return tags.map((tag: any) => tag.tag);
    }

    public getScheduleStats() {
        return;
    }
}

export default AppDatabase;