
type Schedule = {
    id: number;
    recurrence: number;
    Active: {
        Sunday: boolean;
        Monday: boolean;
        Tuesday: boolean;
        Wednesday: boolean;
        Thursday: boolean;
        Friday: boolean;
        Saturday: boolean;
    };
    Deleted: boolean;

}

type Assignment = {
    id: number;
    scheduleID: number;
    categoryTag: string;
    dueDate: string; // ???
    submissionID: number | null;
};

type Submission = {
    id: number;
    dateSubmitted: string; //???
    imageID: number;
}

type Image = {
    id: number;
    type: string;
    path: string;
    tags: string[];
};

type Exercise = {
    id: number;
    exerciseTag: string;
    categoryTag: string;
}

type EventPayloadMapping = {
    
};