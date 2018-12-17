//
module.exports.create = function (unihanBlocks)
{
    let blocksTable = document.createElement ('table');
    blocksTable.className = 'blocks-table';
    let headerRow = document.createElement ('tr');
    headerRow.className = 'header-row';
    let nameHeader = document.createElement ('th');
    nameHeader.className = 'name-header';
    nameHeader.textContent = "Name";
    headerRow.appendChild (nameHeader);
    let rangeHeader = document.createElement ('th');
    rangeHeader.className = 'range-header';
    rangeHeader.textContent = "Range";
    headerRow.appendChild (rangeHeader);
    let sizeHeader = document.createElement ('th');
    sizeHeader.className = 'size-header';
    sizeHeader.textContent = "Size";
    headerRow.appendChild (sizeHeader);
    let charactersHeader = document.createElement ('th');
    charactersHeader.className = 'characters-header';
    charactersHeader.textContent = "Characters";
    headerRow.appendChild (charactersHeader);
    blocksTable.appendChild (headerRow);
    let total = 0;
    for (let unihanBlock of unihanBlocks)
    {
        let dataRow = document.createElement ('tr');
        dataRow.className = 'data-row';
        let dataName = document.createElement ('td');
        dataName.className = 'name';
        dataName.textContent = unihanBlock.name;
        dataRow.appendChild (dataName);
        let dataRange = document.createElement ('td');
        dataRange.className = 'range';
        dataRange.textContent = `U+${unihanBlock.first}..U+${unihanBlock.last}`;
        dataRow.appendChild (dataRange);
        let dataSize = document.createElement ('td');
        dataSize.className = 'size';
        dataSize.textContent = unihanBlock.size;
        dataSize.title = `${unihanBlock.size / 16} × 16`;
        dataRow.appendChild (dataSize);
        let dataCharacters = document.createElement ('td');
        dataCharacters.className = 'characters';
        let count = unihanBlock.count;
        total += count;
        dataCharacters.textContent = count.toLocaleString ('en');
        dataRow.appendChild (dataCharacters);
        blocksTable.appendChild (dataRow);
    }
    let totalRow = document.createElement ('tr');
    totalRow.className = 'data-row';
    let dataTotal = document.createElement ('td');
    dataTotal.colSpan = 4;
    dataTotal.className = 'total';
    dataTotal.textContent = total.toLocaleString ('en');
    totalRow.appendChild (dataTotal);
    blocksTable.appendChild (totalRow);
    return blocksTable;
}
//
