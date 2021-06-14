console.log('Load N-queen test');

const nqTest = (size, fixQueens = []) => {
    const fixed = new Map(fixQueens);
    const qs = nQueenSolver_max32(size, fixQueens)
    const target = document.getElementById('target>');
    target.innerHTML = '';
    const table = document.createElement('table');
    for (let r = 0; r < qs.length; r++) {
        let row = document.createElement('tr');
        for (let c = 0; c < qs.length; c++) {
            let cell = document.createElement('td');
            Object.assign(cell.style, {
                width: '2rem',
                height: '2rem',
                backgroundColor: ((r + c) & 1) ? '#ddd' : '#777',
                textAlign: 'center',
                fontSize: '1.5rem',
            });
            if (qs[r] == c) cell.textContent = '♛';
            let fix = fixed.get(r);
            if (fix === c) {
                cell.style.color = '#500';
            }
            cell.setAttribute('title', `${r} : ${c}`);
            row.appendChild(cell);
        }
        table.appendChild(row);
    }
    target.appendChild(table);
}