export class ApiService {
    constructor(baseUrl) {
        this.baseUrl = baseUrl;
    }

    getWorkoutTypes() {
        return fetch(`${this.baseUrl}/workoutTypes`).then(res => res.json());
    }

    getExercisesByCategory(category) {
        return fetch(`${this.baseUrl}/exercises?category=${category}`).then(res => res.json());
    }

    getTip() {
        const randomId = Math.floor(Math.random() * 6) + 1;
        return fetch(`${this.baseUrl}/tips/${randomId}`).then(res => res.json());
    }
    
    getQuote() {
        const randomId = Math.floor(Math.random() * 7) + 1;
        return fetch(`${this.baseUrl}/quotes/${randomId}`).then(res => res.json());
    }
}