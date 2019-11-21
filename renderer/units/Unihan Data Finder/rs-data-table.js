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
            params.compactLayout = event.currentTarget.checked;
            charactersData.classList.toggle ('compact-layout');
        }
    );
    layoutOptionsGroup.appendChild (compactLabel);
    dataTable.appendChild (layoutOptionsGroup);
    //
    let chart = document.createElement ('div');
    chart.className = 'rs-data-chart';
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
            { root: params.root, rootMargin: '200% 0%' }
        );
    }
    //
    let titleHeader = document.createElement ('div');
    titleHeader.className = 'title-header';
    titleHeader.textContent = title;
    chart.appendChild (titleHeader);
    //
    let charactersData = document.createElement ('div');
    charactersData.className = 'characters-data';
    if (params.compactLayout)
    {
        charactersData.classList.add ('compact-layout');
    }
    let separator = false;
    for (let item of items)
    {
        if (item.characters.length > 0)
        {
            if (separator)
            {
                let strokesSeparator = document.createElement ('div');
                strokesSeparator.className = 'strokes-separator';
                charactersData.appendChild (strokesSeparator);
            }
            separator = true;
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
                codePoint.textContent = character.code;
                codePoint.className = 'code-point';
                characterData.appendChild (codePoint );
                charactersData.appendChild (characterData);
            }
            chart.appendChild (charactersData);
        }
    }
    dataTable.appendChild (chart);
    //
    return dataTable;
}
//
