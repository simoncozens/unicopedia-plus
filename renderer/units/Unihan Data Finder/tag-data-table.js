//
const deferredSymbols = (process.platform === 'darwin');
//
module.exports.create = function (characterInfos, params)
{
    function updateDataPage (dataPage)
    {
        // Update pagination bar
        firstPageButton.disabled = (pageIndex === 0);
        firstPageButton.title = `First page: ${0 + 1}`;
        prevPageButton.disabled = (pageIndex === 0);
        prevPageButton.title = `Previous page: ${pageIndex - 1 + 1}`;
        if (pageSelect.value !== (pageIndex + 1))
        {
            pageSelect.value = pageIndex + 1;
        }
        pageSelect.disabled = (pages.length === 1);
        pageSelect.title = `Current page: ${pageIndex + 1}`;
        nextPageButton.disabled = (pageIndex === (pages.length - 1));
        nextPageButton.title = `Next page: ${pageIndex + 1 + 1}`;
        lastPageButton.disabled = (pageIndex === (pages.length - 1));
        lastPageButton.title = `Last page: ${pages.length}`;
        //
        let characterInfos = pages[pageIndex];
        while (dataPage.firstChild)
        {
            dataPage.firstChild.remove ();
        }
        if (deferredSymbols)
        {
            params.observer = new IntersectionObserver
            (
                (entries, observer) =>
                {
                    entries.forEach
                    (
                        entry =>
                        {
                            if (entry.isIntersecting)
                            {
                                let symbol = entry.target;
                                if (symbol.textContent !== symbol.dataset.character)
                                {
                                    symbol.textContent = symbol.dataset.character;
                                    observer.unobserve (symbol);
                                }
                            }
                        }
                    );
                },
                { root: params.root, rootMargin: '50% 0%' }
            );
        }
        //
        let table = document.createElement ('table');
        table.className = 'data-table';
        //
        let headerRow = document.createElement ('tr');
        headerRow.className = 'header-row';
        let headerSymbol = document.createElement ('th');
        headerSymbol.className = 'header-symbol';
        headerSymbol.textContent = "Symbol";
        headerRow.appendChild (headerSymbol);
        let headerCodePoint = document.createElement ('th');
        headerCodePoint.className = 'header-code-point';
        headerCodePoint.textContent = "Code\xA0Point";
        headerRow.appendChild (headerCodePoint);
        let headerTag = document.createElement ('th');
        headerTag.className = 'header-tag';
        headerTag.textContent = "Unihan\xA0Tag";
        headerRow.appendChild (headerTag);
        let headerValue = document.createElement ('th');
        headerValue.className = 'header-value';
        headerValue.textContent = "Value";
        headerRow.appendChild (headerValue);
        table.appendChild (headerRow);
        //
        for (let characterInfo of characterInfos)
        {
            let dataRow = document.createElement ('tr');
            dataRow.className = 'data-row';
            let dataSymbol = document.createElement ('td');
            dataSymbol.className = 'data-symbol';
            if (deferredSymbols)
            {
                dataSymbol.textContent = "\u3000";  // Ideographic space
                dataSymbol.dataset.character = characterInfo.character;
                params.observer.observe (dataSymbol);
            }
            else
            {
                dataSymbol.textContent = characterInfo.character;
            }
            dataRow.appendChild (dataSymbol);
            let dataCodePoint = document.createElement ('td');
            dataCodePoint.className = 'data-code-point';
            dataCodePoint.textContent = characterInfo.codePoint;
            dataRow.appendChild (dataCodePoint);
            let dataTag = document.createElement ('td');
            dataTag.className = 'data-tag';
            dataTag.textContent = characterInfo.tag;
            dataRow.appendChild (dataTag);
            let dataValue = document.createElement ('td');
            dataValue.className = 'data-value';
            let value = characterInfo.value;
            if (Array.isArray (value))
            {
                let list = document.createElement ('ul');
                list.className = 'list';
                for (let element of value)
                {
                    let item = document.createElement ('li');
                    item.className = 'item';
                    item.textContent = element;
                    list.appendChild (item);
                }
                dataValue.appendChild (list);
            }
            else
            {
                dataValue.textContent = value;
            }
            dataRow.appendChild (dataValue);
            table.appendChild (dataRow);
        }
        //
        dataPage.appendChild (table);
    }
    //
    let pages;
    let pageIndex;
    //
    let dataTable = document.createElement ('div');
    //
    let paginationBar = document.createElement ('div');
    paginationBar.className = 'pagination-bar';
    //
    let navigationGroup = document.createElement ('div');
    navigationGroup.className = 'pagination-group';
    //
    let firstPageButton = document.createElement ('button');
    firstPageButton.type = 'button';
    firstPageButton.className = 'page-nav-button first-page-button';
    firstPageButton.innerHTML = '<svg class="page-nav-icon" viewBox="0 0 10 10"><polygon points="0,5 4,1 5,2 2,5 5,8 4,9" /><polygon points="4,5 8,1 9,2 6,5 9,8 8,9" /></svg>';
    firstPageButton.addEventListener
    (
        'click',
        (event) =>
        {
            if (pageIndex > 0)
            {
                pageIndex = 0;
                updateDataPage (dataPage);
            }
        }
    );
    navigationGroup.appendChild (firstPageButton);
    //
    let prevPageButton = document.createElement ('button');
    prevPageButton.type = 'button';
    prevPageButton.className = 'page-nav-button prev-page-button';
    prevPageButton.innerHTML = '<svg class="page-nav-icon" viewBox="0 0 10 10"><polygon points="2,5 6,1 7,2 4,5 7,8 6,9" /></svg>';
    prevPageButton.addEventListener
    (
        'click',
        (event) =>
        {
            if (pageIndex > 0)
            {
                pageIndex = pageIndex - 1;
                updateDataPage (dataPage);
            }
        }
    );
    navigationGroup.appendChild (prevPageButton);
    //
    let pageSelect = document.createElement ('input');
    pageSelect.type = 'number';
    pageSelect.className = 'page-select';
    pageSelect.addEventListener
    (
        'input',
        (event) =>
        {
            if (event.target.value !== "")
            {
                if (event.target.value < 1)
                {
                    event.target.value = 1;
                }
                else if (event.target.value > pages.length)
                {
                    event.target.value = pages.length;
                }
                pageIndex = event.target.value - 1;
                updateDataPage (dataPage);
            }
        }
    );
    pageSelect.addEventListener
    (
        'blur',
        (event) =>
        {
            if (event.target.value === "")
            {
                event.target.value = pageIndex + 1;
            }
        }
    );
    navigationGroup.appendChild (pageSelect);
    //
    let nextPageButton = document.createElement ('button');
    nextPageButton.type = 'button';
    nextPageButton.className = 'page-nav-button next-page-button';
    nextPageButton.innerHTML = '<svg class="page-nav-icon" viewBox="0 0 10 10"><polygon points="6,5 3,2 4,1 8,5 4,9 3,8" /></svg>';
    nextPageButton.addEventListener
    (
        'click',
        (event) =>
        {
            if (pageIndex < (pages.length - 1))
            {
                pageIndex = pageIndex + 1;
                updateDataPage (dataPage);
            }
        }
    );
    navigationGroup.appendChild (nextPageButton);
    //
    let lastPageButton = document.createElement ('button');
    lastPageButton.type = 'button';
    lastPageButton.className = 'page-nav-button last-page-button';
    lastPageButton.innerHTML = '<svg class="page-nav-icon" viewBox="0 0 10 10"><polygon points="4,5 1,2 2,1 6,5 2,9 1,8" /><polygon points="8,5 5,2 6,1 10,5 6,9 5,8" /></svg>';
    lastPageButton.addEventListener
    (
        'click',
        (event) =>
        {
            if (pageIndex < (pages.length - 1))
            {
                pageIndex = pages.length - 1;
                updateDataPage (dataPage);
            }
        }
    );
    navigationGroup.appendChild (lastPageButton);
    //
    paginationBar.appendChild (navigationGroup);
    //
    let pageInfoGroup = document.createElement ('div');
    pageInfoGroup.className = 'pagination-group';
    //
    let pageInfo = document.createElement ('div');
    pageInfo.className = 'page-info';
    //
    pageInfoGroup.appendChild (pageInfo);
    //
    paginationBar.appendChild (pageInfoGroup);
    //
    const pageSizes = [ 4, 8, 16, 32, 64, 128, 256, 512, 1024 ];
    //
    let pageSizeGroup = document.createElement ('div');
    pageSizeGroup.className = 'pagination-group';
    //
    let pageSizeLabel = document.createElement ('label');
    let pageSizeSelect = document.createElement ('select');
    pageSizeSelect.className = 'page-size-select';
    pageSizes.forEach
    (
        (pageSize) =>
        {
            let pageSizeOption = document.createElement ('option');
            pageSizeOption.textContent = pageSize;
            pageSizeSelect.appendChild (pageSizeOption);
        }
    );
    //
    pageSizeLabel.appendChild (pageSizeSelect);
    let pageSizeText = document.createTextNode ("\xA0\xA0per page");
    pageSizeLabel.appendChild (pageSizeText);
    pageSizeGroup.appendChild (pageSizeLabel);
    //
    pageSizeSelect.value = params.pageSize;
    if (pageSizeSelect.selectedIndex < 0) // -1: no element is selected
    {
        pageSizeSelect.selectedIndex = 0;
    }
    //
    pageSizeSelect.addEventListener
    (
        'input',
        (event) =>
        {
            params.pageSize = parseInt (event.target.value);
            //
            // Paginate
            pages = [ ];
            for (let startIndex = 0; startIndex < characterInfos.length; startIndex += params.pageSize)
            {
                pages.push (characterInfos.slice (startIndex, startIndex + params.pageSize));
            }
            pageIndex = 0;
            let pageCount = pages.length;
            pageSelect.min = 1;
            pageSelect.max = pageCount;
            pageSelect.value = pageIndex + 1;
            pageInfo.innerHTML = (pageCount > 1) ? `<strong>${pageCount}</strong>&nbsp;pages` : "";
            updateDataPage (dataPage);
        }
    );
    //
    paginationBar.appendChild (pageSizeGroup);
    //
    dataTable.appendChild (paginationBar);
    let dataPage = document.createElement ('div');
    dataTable.appendChild (dataPage);
    //
    pageSizeSelect.dispatchEvent (new Event ('input'));
    //
    return dataTable;
}
//
