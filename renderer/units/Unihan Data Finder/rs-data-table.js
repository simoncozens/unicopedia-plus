//
const deferredSymbols = (process.platform === 'darwin');
//
module.exports.create = function (title, items, params)
{
    let dataTable = document.createElement ('div');
    //
    let layoutOptionsGroup = document.createElement ('div');
    layoutOptionsGroup.className = 'rs-layout-options-group';
    let compactLabel = document.createElement ('label');
    let compactCheckbox = document.createElement ('input');
    compactLabel.appendChild (compactCheckbox);
    compactLabel.appendChild (document.createTextNode ("\xA0Compact Layout"));
    compactCheckbox.class = 'compact-checkbox';
    compactCheckbox.type = 'checkbox';
    compactCheckbox.checked = params.compactLayout;
    compactCheckbox.addEventListener
    (
        'input',
        event =>
        {
            params.compactLayout = event.target.checked;
            charactersData.classList.toggle ('compact-layout');
        }
    );
    layoutOptionsGroup.appendChild (compactLabel);
    dataTable.appendChild (layoutOptionsGroup);
    //
    let table = document.createElement ('table');
    table.className = 'rs-data-table';
    //
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
                                symbol.classList.remove ('deferred');
                                observer.unobserve (symbol);
                            }
                        }
                    }
                );
            },
            { root: params.root, rootMargin: '100% 0%' }
        );
    }
    //
    let titleRow = document.createElement ('tr');
    titleRow.className = 'title-row';
    let titleHeader = document.createElement ('th');
    titleHeader.className = 'title-header';
    titleHeader.textContent = title;
    titleRow.appendChild (titleHeader);
    table.appendChild (titleRow);
    //
    let charactersRow = document.createElement ('tr');
    charactersRow.className = 'characters-row';
    let charactersData = document.createElement ('td');
    charactersData.className = 'characters-data';
    if (params.compactLayout)
    {
        charactersData.classList.add ('compact-layout');
    }
    for (let item of items)
    {
        if (item.characters.length > 0)
        {
            let strokesData = document.createElement ('span');
            strokesData.className = 'strokes-data';
            let shortTitle = document.createElement ('span');
            shortTitle.className  = 'short-title';
            shortTitle.textContent = item.shortTitle;
            strokesData.appendChild (shortTitle);
            let longTitle = document.createElement ('span');
            longTitle.className = 'long-title';
            longTitle.textContent = item.longTitle;
            strokesData.appendChild (longTitle);
            charactersData.appendChild (strokesData);
            for (let character of item.characters)
            {
                let characterData = document.createElement ('span');
                characterData.className = 'character-data';
                if (character.extraSource)
                {
                    characterData.classList.add ('extra-source');
                    characterData.title = character.toolTip;
                }
                let symbol = document.createElement ('span');
                symbol.className = 'symbol';
                if (deferredSymbols)
                {
                    symbol.textContent = "\u3000";  // Ideographic space
                    symbol.classList.add ('deferred');
                    symbol.dataset.character = character.symbol;
                    params.observer.observe (symbol);
                }
                else
                {
                    symbol.textContent = character.symbol;
                }
                characterData.appendChild (symbol);
                let codePoint = document.createElement ('span');
                codePoint.textContent = character.codePoint.replace ("U+", "");
                codePoint.className = 'code-point';
                characterData.appendChild (codePoint );
                charactersData.appendChild (characterData);
            }
            charactersRow.appendChild (charactersData);
            table.appendChild (charactersRow);
        }
    }
    dataTable.appendChild (table);
    //
    return dataTable;
}
//
