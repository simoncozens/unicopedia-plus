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
    let coreSetHeader = document.createElement ('th');
    coreSetHeader.className = 'core-set-header';
    coreSetHeader.textContent = "IICore";
    headerRow.appendChild (coreSetHeader);
    let fullSetHeader = document.createElement ('th');
    fullSetHeader.className = 'full-set-header';
    fullSetHeader.textContent = "Full Set";
    headerRow.appendChild (fullSetHeader);
    blocksTable.appendChild (headerRow);
    let coreTotal = 0;
    let fullTotal = 0;
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
        let dataCoreSet = document.createElement ('td');
        dataCoreSet.className = 'core-set';
        let coreCount = unihanBlock.coreCount;
        coreTotal += coreCount;
        dataCoreSet.textContent = coreCount.toLocaleString ('en');
        dataRow.appendChild (dataCoreSet);
        let dataFullSet = document.createElement ('td');
        dataFullSet.className = 'full-set';
        let fullCount = unihanBlock.fullCount;
        fullTotal += fullCount;
        dataFullSet.textContent = fullCount.toLocaleString ('en');
        dataRow.appendChild (dataFullSet);
        blocksTable.appendChild (dataRow);
    }
    let totalRow = document.createElement ('tr');
    totalRow.className = 'data-row';
    let dataPaddingTotal = document.createElement ('td');
    dataPaddingTotal.colSpan = 3;
    dataPaddingTotal.className = 'padding-total';
    dataPaddingTotal.textContent = "";
    totalRow.appendChild (dataPaddingTotal);
    let dataCoreTotal = document.createElement ('td');
    dataCoreTotal.className = 'core-total';
    dataCoreTotal.textContent = coreTotal.toLocaleString ('en');
    totalRow.appendChild (dataCoreTotal);
    let dataFullTotal = document.createElement ('td');
    dataFullTotal.className = 'full-total';
    dataFullTotal.textContent = fullTotal.toLocaleString ('en');
    totalRow.appendChild (dataFullTotal);
    blocksTable.appendChild (totalRow);
    return blocksTable;
}
//
