// Generate Keycap Bases
let keycaps = [ "#", "*", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9" ];
let keycapBases = [ ];
for (let keycap of keycaps)
{
    keycapBases.push (keycap + "\uFE0F");
}
$.write ($.stringify (keycapBases));
