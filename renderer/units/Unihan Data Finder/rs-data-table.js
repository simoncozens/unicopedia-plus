//
const deferredSymbols = true;
//
module.exports.create = function (title, items, params)
{
    let rsDataTable = document.createElement ('table');
    rsDataTable.className = 'rs-data-table';
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
    rsDataTable.appendChild (titleRow);
    //
    let charactersRow = document.createElement ('tr');
    charactersRow.className = 'characters-row';
    let charactersData = document.createElement ('td');
    charactersData.className = 'characters-data';
    for (let item of items)
    {
        let strokesData = document.createElement ('span');
        strokesData.className = 'strokes-data';
        strokesData.textContent = `${item.strokes} Stroke${item.strokes > 1 ? 's': ''}`;
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
        rsDataTable.appendChild (charactersRow);
    }
    //
    return rsDataTable;
}
//
