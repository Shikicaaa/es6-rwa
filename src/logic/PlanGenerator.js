const planStructureCalisthenics = [
    { day: 1, focus: "Grudi & Triceps", groups: ["grudi", "triceps", "rame"] },
    { day: 2, focus: "Leđa & Biceps", groups: ["ledja", "biceps"] },
    { day: 3, focus: "Noge", groups: ["noge"] },
    { day: 4, focus: "Odmor", groups: [] },
    { day: 5, focus: "Stomak & Kardio", groups: ["stomak"] },
    { day: 6, focus: "Celo Telo", groups: ["grudi", "ledja", "noge"] },
    { day: 7, focus: "Odmor", groups: [] },
];

const planStructureGym = [
    { day: 1, focus: "Upper strength", groups: ["grudi", "ledja"] },
    { day: 2, focus: "Lower strength", groups: ["noge", "stomak", ] },
    { day: 3, focus: "Odmor", groups: [] },
    { day: 4, focus: "Push", groups: ["grudi", "triceps", "rame"] },
    { day: 5, focus: "Pull", groups: ["ledja", "biceps"] },
    { day: 6, focus: "Legs", groups: ["noge", "stomak"] },
    { day: 7, focus: "Odmor", groups: [] },
]

const planStructureIstezanje = [
    { day: 1, focus: "Hip flexor & Splits prep", groups: ["noge", "kukovi"] },
    { day: 2, focus: "Hamstrings & L-sit prep", groups: ["stomak", "noge"] },
    { day: 3, focus: "Scapula & Core prep", groups: ["stomak", "ledja", "rame"] },
    { day: 4, focus: "Shoulders & Mobility", groups: ["rame"] },
    { day: 5, focus: "Pike & Flexibility", groups: ["stomak", "noge"] },
    { day: 6, focus: "Backbend / Bridge", groups: ["stomak", "ledja", "rame"] },
    { day: 7, focus: "Odmor / Laka mobilnost", groups: [] },
];


function getRandomExercises(arr, num) {
    if (num <= 0) return [];
    const uniqueArr = Array.from(new Map(arr.map(ex => [ex.id, ex])).values());
    return [...uniqueArr].sort(() => 0.5 - Math.random()).slice(0, num);
}

export function generateWorkoutPlan(exercises, type, goal = "general") {
    const planStructure = 
        type === "kalistenika" ? planStructureCalisthenics : 
        (type === "teretana" ? planStructureGym : planStructureIstezanje);

    const twoWeekPlan = [
        ...planStructure,
        ...planStructure.map(d => ({ ...d, day: d.day + 7 }))
    ];

    return twoWeekPlan.map(dayInfo => {
        if (dayInfo.groups.length === 0) return { ...dayInfo, exercises: [] };

        const relevantExercisesDuplicates = dayInfo.groups.reduce((acc, group) => {
            const groupExercises = exercises.filter(ex => ex.groups.includes(group));
            return [...acc, ...groupExercises];
        }, []);

        const relevantExercises = Array.from(new Map(relevantExercisesDuplicates.map(ex => [ex.id, ex])).values());

        let selectedExercises = [];
        const EXERCISES_PER_DAY = 7;

        if (goal === "snaga") {
            const mandatory = relevantExercises.filter(ex => ex.mandatoryForGoal?.includes(goal));
            const optional = relevantExercises.filter(ex => !ex.mandatoryForGoal?.includes(goal));
            
            selectedExercises = [...mandatory];
            
            const remainingSlots = EXERCISES_PER_DAY - selectedExercises.length;
            selectedExercises.push(...getRandomExercises(optional, remainingSlots));
        } else {
            selectedExercises = getRandomExercises(relevantExercises, EXERCISES_PER_DAY);
        }

        const exercisesWithSetsReps = selectedExercises.map(ex => {
            let reps = "3x10";

            if (type === "istezanje") {
                reps = ex.defaultReps?.flexibility || "3x20s";
            } else {
                if (goal === "snaga") {
                    reps = ex.defaultReps?.snaga || "5x5"; 
                } else if (goal === "hipertrofija") {
                    reps = ex.defaultReps?.hipertrofija || "4x10";
                }
            }
            
            return { ...ex, reps };
        });

        return {
            ...dayInfo,
            exercises: exercisesWithSetsReps
        };
    });
}
