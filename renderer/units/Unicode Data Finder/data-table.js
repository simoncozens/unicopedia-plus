//
const deferredSymbols = true;
//
const unicode = require ('../../lib/unicode/unicode.js');
//
module.exports.create = function (node, characters, params)
{
    function updateDataPage (dataPage)
    {
        // Update pagination bar
        firstPageButton.disabled = (charactersPageIndex === 0);
        firstPageButton.title = `First page: ${0 + 1}`;
        prevPageButton.disabled = (charactersPageIndex === 0);
        prevPageButton.title = `Previous page: ${charactersPageIndex - 1 + 1}`;
        if (pageSelect.value !== (charactersPageIndex + 1))
        {
            pageSelect.value = charactersPageIndex + 1;
        }
        pageSelect.disabled = (charactersPages.length === 1);
        pageSelect.title = `Current page: ${charactersPageIndex + 1}`;
        nextPageButton.disabled = (charactersPageIndex === (charactersPages.length - 1));
        nextPageButton.title = `Next page: ${charactersPageIndex + 1 + 1}`;
        lastPageButton.disabled = (charactersPageIndex === (charactersPages.length - 1));
        lastPageButton.title = `Last page: ${charactersPages.length}`;
        //
        let characters = charactersPages[charactersPageIndex];
        while (dataPage.firstChild) { dataPage.firstChild.remove (); };
        let observer;
        if (deferredSymbols)
        {
            observer = new IntersectionObserver
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
                { root: dataPage.closest ('section'), rootMargin: '50% 0%' }
            );
        }
        let table = document.createElement ('table');
        table.className = 'data-table';
        let header = document.createElement ('tr');
        header.className = 'header';
        let symbolHeader = document.createElement ('th');
        symbolHeader.className = 'symbol-header';
        symbolHeader.textContent = "Symbol";
        header.appendChild (symbolHeader);
        let codePointHeader = document.createElement ('th');
        codePointHeader.className = 'code-point-header';
        codePointHeader.textContent = "Code\xA0Point";
        header.appendChild (codePointHeader);
        let nameHeader = document.createElement ('th');
        nameHeader.className = 'name-header';
        nameHeader.textContent = "Name";
        header.appendChild (nameHeader);
        table.appendChild (header);
        for (let character of characters)
        {
            let data = unicode.getCharacterBasicData (character);
            let row = document.createElement ('tr');
            row.className = 'row';
            let symbol = document.createElement ('td');
            symbol.className = 'symbol';
            if (deferredSymbols)
            {
                symbol.textContent = "\xA0";
                symbol.dataset.character = ((data.name === "<control>") || (character === " ")) ? "\xA0" : data.character;
                observer.observe (symbol);
            }
            else
            {
                symbol.textContent = ((data.name === "<control>") || (character === " ")) ? "\xA0" : data.character;
            }
            row.appendChild (symbol);
            let codePoint = document.createElement ('td');
            codePoint.className = 'code-point';
            codePoint.textContent = data.codePoint;
            row.appendChild (codePoint);
            let names = document.createElement ('td');
            names.className = 'names';
            let name = document.createElement ('div');
            name.className = 'name';
            name.textContent = data.name;
            names.appendChild (name);
            if (data.alias)
            {
                let alias = document.createElement ('div');
                alias.className = 'alias';
                alias.textContent = data.alias;
                names.appendChild (alias);
            }
            if (data.correction)
            {
                let alias = document.createElement ('div');
                alias.className = 'correction';
                alias.textContent = data.correction;
                alias.title = "CORRECTION";
                names.appendChild (alias);
            }
            row.appendChild (names);
            table.appendChild (row);
        }
        dataPage.appendChild (table);
    }
    //
    let charactersPages;
    let charactersPageIndex;
    //
    let paginationBar = document.createElement ('div');
    paginationBar.className = 'pagination-bar';
    //
    let navigationGroup = document.createElement ('div');
    navigationGroup.className = 'pagination-group';
    //
    const xmlns= 'http://www.w3.org/2000/svg';
    //
    let svg;
    let use;
    //
    let firstPageButton = document.createElement ('button');
    firstPageButton.type = 'button';
    firstPageButton.className = 'page-nav-button first-page-button';
    svg = document.createElementNS (xmlns, 'svg');
    svg.setAttributeNS (null, 'class', 'page-nav-icon');
    use = document.createElementNS (xmlns, 'use');
    use.setAttributeNS (null, 'href', 'images/navigation.svg#first-page');
    svg.appendChild (use);
    firstPageButton.appendChild (svg);
    firstPageButton.addEventListener
    (
        'click',
        (event) =>
        {
            if (charactersPageIndex > 0)
            {
                charactersPageIndex = 0;
                updateDataPage (dataPage);
            }
        }
    );
    navigationGroup.appendChild (firstPageButton);
    //
    let prevPageButton = document.createElement ('button');
    prevPageButton.type = 'button';
    prevPageButton.className = 'page-nav-button prev-page-button';
    svg = document.createElementNS (xmlns, 'svg');
    svg.setAttributeNS (null, 'class', 'page-nav-icon');
    use = document.createElementNS (xmlns, 'use');
    use.setAttributeNS (null, 'href', 'images/navigation.svg#prev-page');
    svg.appendChild (use);
    prevPageButton.appendChild (svg);
    prevPageButton.addEventListener
    (
        'click',
        (event) =>
        {
            if (charactersPageIndex > 0)
            {
                charactersPageIndex = charactersPageIndex - 1;
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
                else if (event.target.value > charactersPages.length)
                {
                    event.target.value = charactersPages.length;
                }
                charactersPageIndex = event.target.value - 1;
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
                event.target.value = charactersPageIndex + 1;
            }
        }
    );
    pageSelect.addEventListener
    (
        'keydown',
        (event) =>
        {
            if (event.key === "ArrowLeft")
            {
                event.preventDefault ();
                prevPageButton.click ();
            }
            else if (event.key === "ArrowRight")
            {
                event.preventDefault ();
                nextPageButton.click ();
            }
        }
    );
    navigationGroup.appendChild (pageSelect);
    //
    let nextPageButton = document.createElement ('button');
    nextPageButton.type = 'button';
    nextPageButton.className = 'page-nav-button next-page-button';
    svg = document.createElementNS (xmlns, 'svg');
    svg.setAttributeNS (null, 'class', 'page-nav-icon');
    use = document.createElementNS (xmlns, 'use');
    use.setAttributeNS (null, 'href', 'images/navigation.svg#next-page');
    svg.appendChild (use);
    nextPageButton.appendChild (svg);
    nextPageButton.addEventListener
    (
        'click',
        (event) =>
        {
            if (charactersPageIndex < (charactersPages.length - 1))
            {
                charactersPageIndex = charactersPageIndex + 1;
                updateDataPage (dataPage);
            }
        }
    );
    navigationGroup.appendChild (nextPageButton);
    //
    let lastPageButton = document.createElement ('button');
    lastPageButton.type = 'button';
    lastPageButton.className = 'page-nav-button last-page-button';
    lastPageButton.addEventListener
    (
        'click',
        (event) =>
        {
            if (charactersPageIndex < (charactersPages.length - 1))
            {
                charactersPageIndex = charactersPages.length - 1;
                updateDataPage (dataPage);
            }
        }
    );
    svg = document.createElementNS (xmlns, 'svg');
    svg.setAttributeNS (null, 'class', 'page-nav-icon');
    use = document.createElementNS (xmlns, 'use');
    use.setAttributeNS (null, 'href', 'images/navigation.svg#last-page');
    svg.appendChild (use);
    lastPageButton.appendChild (svg);
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
    const pageSizes = [ 8, 16, 32, 64, 128, 256, 512, 1024, 2048, 4096 ];
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
    let pageSizeText = document.createTextNode ("\xA0\xA0results per page");
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
            // Paginate
            charactersPages = [ ];
            for (let startIndex = 0; startIndex < characters.length; startIndex += params.pageSize)
            {
                charactersPages.push (characters.slice (startIndex, startIndex + params.pageSize));
            }
            charactersPageIndex = 0;
            let pageCount = charactersPages.length;
            pageSelect.min = 1;
            pageSelect.max = pageCount;
            pageSelect.value = charactersPageIndex + 1;
            pageInfo.innerHTML = (pageCount > 1) ? `<strong>${pageCount}</strong>&nbsp;pages` : "";
            updateDataPage (dataPage);
        }
    );
    //
    paginationBar.appendChild (pageSizeGroup);
    //
    node.appendChild (paginationBar);
    let dataPage = document.createElement ('div');
    node.appendChild (dataPage);
    //
    pageSizeSelect.dispatchEvent (new Event ('input'));
}
//
