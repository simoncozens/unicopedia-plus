// Get Block Statistics
const { blocks } = require ('./lib/unicode/parsed-extra-data.js');
blocks.sort ((a, b) => ((parseInt (a.last, 16) - parseInt (a.first, 16)) - (parseInt (b.last, 16) - parseInt (b.first, 16)))).reverse ();
blocks.forEach
(
    block =>
    {
        let size = parseInt (block.last, 16) - parseInt (block.first, 16) + 1;
        $.writeln (`${block.name}: ${size} (${size / 16} × 16)`);
    }
);
