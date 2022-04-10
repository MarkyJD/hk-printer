function trimWhiteSpace(str) {
  return str.trim().replace(/\s+/, ' ');
}

function getNumber(str) {
  let result = str.trim().replace(/[^0-9]+/, '');
  if (result.length > 3) {
    result = result.substring(1);
  }
  return result;
}

function getOccupants(str) {
  const numberTypePairs = str.split(' ');
  let total = 0;
  for (let i = 0; i < numberTypePairs.length; i++) {
    if (numberTypePairs[i].charAt(1) !== 'B') {
      total += parseInt(numberTypePairs[i].charAt(0));
    }
  }
  return `<strong>${total}</strong> (${str})`;
}

function findTables() {
  const allTables = document.querySelectorAll('.task_list');
  if (!allTables) {
    return [];
  }
  return Array.from(allTables);
}

function cleanData(data) {
  const todo = [];
  const inCompleted = data.filter((row) => !row.completed);
  const preArrivals = inCompleted.filter(
    (row) => row.type === 'Pre Arrival Check'
  );
  const departures = inCompleted.filter(
    (row) => row.type === 'Departure Clean'
  );

  departures.forEach((departure) => {
    let isPriority = false;

    if (preArrivals.find((el) => el.location === departure.location)) {
      isPriority = true;
    }
    todo.push({
      ...departure,
      type: isPriority ? 'P' : '',
    });
  });

  return todo;
}

function buildTable(data) {
  const tableStyle =
    'font-size: 10px; width: 100%; background-color: white; margin: 0 auto;';

  const wrapperStyle = 'width: 100%; padding: 0;';

  const rowStyle = 'padding: 10px 0; border-bottom: dashed 1px #adadad;';

  const info = cleanData(data);

  let tableData = `
  <div style="${wrapperStyle}">
  <table style="${tableStyle}">
    <thead>
      <tr>
        <th scope="col" style="width: 5%; ${rowStyle}"><strong>Type</strong></th>
        <th style="width: 5%; ${rowStyle}"><strong>Unit</strong></th>
        <th style="width: 10%; ${rowStyle}"><strong>Occupants</strong></th>
        <th style="width: 10%; ${rowStyle}"><strong>Bedding</strong></th>
        <th style="width: 10%; ${rowStyle}"><strong>ETA</strong></th>
        <th style="width: 30%; ${rowStyle}"><strong>Maintenance</strong></th>
        <th style="width: 10%; ${rowStyle}"><strong>Staff</strong></th>
      </tr>
    </thead>
    <tbody>
  `;
  tableData += info
    .map((value) => {
      return `<tr>
        <td style="${rowStyle}"><em>${value.type}</em></td>
        <td style="${rowStyle}"><strong>${value.location}</strong></td>
        <td style="${rowStyle}">${value.occupants}</td>
        <td style="${rowStyle}">${value.bedding}</td>
        <td style="${rowStyle}">${value.eta}</td>
        <td style="${rowStyle}"></td>
        <td style="${rowStyle}"></td>
     </tr>`;
    })
    .join('');
  tableData += `
      </tbody>
      <tfoot>
        <tr>
          <td colspan="7" style="text-align: center; ${rowStyle}"><strong>Total: ${
    ' ' + info.length
  }</strong></td>
        </tr>
      </tfoot>
    </table/>
  </div>`;
  const body = document.body;
  const prev = body.innerHTML;
  body.innerHTML = tableData;
  window.print();
  body.innerHTML = prev;
}

function scrape() {
  const tables = [];
  const data = [];
  tables.push(...findTables());

  tables.forEach((table) => {
    const rows = table.querySelectorAll('tr');

    for (let i = 0; i < rows.length; i++) {
      const cols = rows[i].querySelectorAll('td');

      if (cols.length > 0) {
        const completed = cols[0].querySelector('input') === null;
        const type = cols[4].innerText;
        const location = getNumber(cols[2].innerText);
        const occupants = getOccupants(cols[5].innerText);
        const bedding = cols[6].innerText;
        const eta = cols[7].innerText;

        data.push({
          completed,
          type,
          location,
          occupants,
          bedding,
          eta,
        });
      }
    }
  });
  buildTable(data);
}

// const row = thList.map((th) => `"${trimWhiteSpace(th.textContent)}"`);

scrape();
