import { Observable } from 'rxjs';

const typeSelector = document.getElementById('type-selector');
const goalSelector = document.getElementById('goal-selector');
const planContainer = document.getElementById('plan-container');


export function renderTypeButtons(types) {
    const container = document.getElementById('type-buttons');
    container.innerHTML = '<h2>1. Izaberi tip treninga:</h2>';
    typeSelector.innerHTML = '';

    return new Observable(subscriber => {
        types.forEach(type => {
            const btn = document.createElement('button');
            btn.className = 'btn';
            btn.textContent = type.name;

            btn.onclick = () => {
                document.querySelectorAll('#type-selector .btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                planContainer.innerHTML = '';
                goalSelector.innerHTML = '';

                if (type.id === "teretana") {
                    const goals = ["snaga", "hipertrofija"];
                    goals.forEach(goal => {
                        const goalBtn = document.createElement('button');
                        goalBtn.className = 'btn';
                        goalBtn.textContent = goal.charAt(0).toUpperCase() + goal.slice(1);
                        goalBtn.onclick = () => {
                            document.querySelectorAll('#goal-selector .btn').forEach(b => b.classList.remove('active'));
                            goalBtn.classList.add('active');
                            subscriber.next({ typeId: type.id, goal: goal });
                        };
                        goalSelector.appendChild(goalBtn);
                    });
                } else {
                    subscriber.next({ typeId: type.id, goal: 'hipertrofija' });
                }
            };

            typeSelector.appendChild(btn);
        });
    });
}

export function renderPlan(plan, container) {
    container.innerHTML = '';
    plan.forEach(day => {
        const dayCard = document.createElement('div');
        dayCard.classList.add('day-card');

        dayCard.innerHTML = `<h3>Dan ${day.day}: ${day.focus}</h3>`;
        const ul = document.createElement('ul');

        day.exercises.forEach(ex => {
            const li = document.createElement('li');
            li.textContent = `${ex.name} — ${ex.reps}`;
            ul.appendChild(li);
        });

        dayCard.appendChild(ul);
        container.appendChild(dayCard);
    });
}