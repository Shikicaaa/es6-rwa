const typeSelector = document.getElementById('type-selector');
const planContainer = document.getElementById('plan-container');

export function renderTypeButtons(types, selectCallback) {
    const container = document.getElementById('type-buttons');
    if (!container) {
        console.error('Ne postoji container za tipove treninga (id="type-buttons")');
        return;
    }

    container.innerHTML = '<h2>1. Izaberi tip treninga:</h2>';

    types.forEach(type => {
        const btn = document.createElement('button');
        btn.className = 'btn';
        btn.textContent = type.name;

        btn.onclick = () => {
            document.querySelectorAll('#type-buttons .btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            document.getElementById('plan-container').innerHTML = '';
            const goalContainer = document.getElementById('type-selector');
            goalContainer.innerHTML = '';
            
            if (type.id === "teretana") {
                goalContainer.innerHTML = '<h2>2. Izaberi cilj:</h2>';
                const goals = ["snaga", "hipertrofija"];
                goals.forEach(goal => {
                    const goalBtn = document.createElement('button');
                    goalBtn.className = 'btn';
                    goalBtn.textContent = goal.charAt(0).toUpperCase() + goal.slice(1);
                    goalBtn.onclick = () => {
                        document.querySelectorAll('#type-selector .btn').forEach(b => b.classList.remove('active'));
                        goalBtn.classList.add('active');
                        selectCallback(type.id, goal);
                    };
                    goalContainer.appendChild(goalBtn);
                });
            } else {
                selectCallback(type.id, 'hipertrofija');
            }
        };
        container.appendChild(btn);
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

