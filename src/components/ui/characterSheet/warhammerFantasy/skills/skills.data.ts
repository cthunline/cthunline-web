interface ColumnHead {
    textKey: string;
    columnSpan: number;
    center?: boolean;
}

export const columnHeads: ColumnHead[] = [
    {
        textKey: 'skill.name',
        columnSpan: 4
    },
    {
        textKey: 'common.characteristic',
        columnSpan: 2
    },
    {
        textKey: 'skill.advances',
        columnSpan: 1,
        center: true
    },
    {
        textKey: 'skill.skill',
        columnSpan: 1,
        center: true
    }
];
