/** @module dateFromSN */

export const getDateFromOvationSN = ({ serialNo = "", brandId }) => {
  const response = {
    year: "",
    comment: ""
  };
  if (!serialNo || !brandId || !["OV", "ADO"].includes(brandId)) {
    return response;
  }
  const sn = serialNo.toUpperCase();
  const alphaPrefix = [
    "A",
    "B",
    "C",
    "D",
    "E",
    "F",
    "G",
    "H",
    "I",
    "J",
    "L"
  ].includes(sn.charAt(0))
    ? sn.charAt(0)
    : "";
  const snLength = serialNo.length;
  const snNumeric = alphaPrefix ? 0 : Number(sn);

  if (brandId === "OV") {
    switch (true) {
      case snNumeric >= 6 && snNumeric <= 319 && snLength === 3:
        response.year = "1966";
        response.comment = "Three digits in red ink";
        break;
      case snNumeric >= 320 && snNumeric <= 999 && snLength === 3:
        response.year = "1967 (Feb-Nov)";
        response.comment = "New Hartford; three digits in red ink";
        break;
      case snNumeric >= 1000 && snNumeric <= 9999 && snLength === 4:
        response.year = "1967 (Nov)-1968 (July)";
        response.comment = "Four digits in black ink, no letter prefix";
        break;
      case snNumeric >= 10000 && snNumeric <= 99999 && snLength === 5:
        response.year = "1970 (Feb)-1972 (May)";
        response.comment = "Five digits, no letter prefix";
        break;
      case alphaPrefix === "A" && snLength === 4:
        response.year = "1968 (July-Nov)";
        break;
      case alphaPrefix === "B" && snLength === 4:
        response.year = "1968 (Nov)-1969 (Feb)";
        break;
      case alphaPrefix === "B" && snLength === 6:
        response.year = "1974-1979";
        response.comment = "Magnum solid body basses";
        break;
      case alphaPrefix === "C" && snLength === 4:
        response.year = "1969 (Feb-Sept)";
        break;
      case alphaPrefix === "D" && snLength === 4:
        response.year = "1969 (Sept)-1970 (Feb)";
        break;
      case alphaPrefix === "E" && snLength === 5:
        response.year = "1973 (Jan)-1975 (Feb)";
        response.comment = "Solidbodies";
        break;
      case alphaPrefix === "E" && snLength === 6:
        response.year = "1975 (Feb)-1980";
        response.comment = "Solidbodies";
        break;
      case alphaPrefix === "E" && snLength === 7:
        response.year = "1980 (late)-1981";
        response.comment = "Some UK IIs (does not reflect production)";
        break;
      case ["F", "G"].includes(alphaPrefix):
        response.year = "1968 (July)-1970 (Feb)";
        break;
      case ["H", "I", "J", "L"].includes(alphaPrefix):
        response.year = "1970-1973";
        response.comment = "Electric Storm Series";
        break;
      case snNumeric >= 1 && snNumeric <= 7000 && snLength === 6:
        response.year = "1972 (May_Dec)";
        response.comments = "  ";
        break;
      case snNumeric >= 20001 && snNumeric <= 39000 && snLength === 6:
        response.year = "1974";
        break;
      case snNumeric >= 39001 && snNumeric <= 67000 && snLength === 6:
        response.year = "1975";
        break;
      case snNumeric >= 67001 && snNumeric <= 86000 && snLength === 6:
        response.year = "1976";
        break;
      case snNumeric >= 86001 && snNumeric <= 103000 && snLength === 6:
        response.year = "1977 (Jan-Sept)";
        break;
      case snNumeric >= 103001 && snNumeric <= 126000:
        response.year = "1977 (Sept)-1978 (Apr)";
        break;
      case snNumeric >= 126001 && snNumeric <= 157000:
        response.year = "1978 (Apr-Dec)";
        break;
      case snNumeric >= 157001 && snNumeric <= 203000:
        response.year = "1979";
        break;
      case snNumeric >= 211011 && snNumeric <= 214933:
        response.year = "1980";
        break;
      case snNumeric >= 214934 && snNumeric <= 263633:
        response.year = "1981";
        break;
      case snNumeric >= 263634 && snNumeric <= 291456:
        response.year = "1982";
        break;
      case snNumeric >= 291457 && snNumeric <= 302669:
        response.year = "1983";
        break;
      case snNumeric >= 302670 && snNumeric <= 303319:
        response.year = "1984";
        response.comments = "Elites Only";
        break;
      case snNumeric >= 303320 && snNumeric <= 356000:
        response.year = "1985-1986";
        break;
      case snNumeric >= 315001 && snNumeric <= 339187:
        response.year = "1984";
        response.comments = "Balladeers Only";
        break;
      case snNumeric >= 357000 && snNumeric <= 367999:
        response.year = "1987";
        break;
      case snNumeric >= 368000 && snNumeric <= 382106:
        response.year = "1988";
        break;
      case snNumeric >= 382107 && snNumeric <= 392900:
        response.year = "1989";
        break;
      case snNumeric >= 400001 && snNumeric <= 403676:
        response.year = "1991";
        break;
      case snNumeric >= 402700 && snNumeric <= 406000:
        response.year = "1992";
        break;
      case snNumeric >= 403760 && snNumeric <= 420400:
        response.year = "1990";
        break;
      case snNumeric >= 421000 && snNumeric <= 430680:
        response.year = "1990";
        break;
      case snNumeric >= 430681 && snNumeric <= 446000:
        response.year = "1991";
        break;
      case snNumeric >= 446001 && snNumeric <= 457810:
        response.year = "1992";
        break;
      case snNumeric >= 457811 && snNumeric <= 470769:
        response.year = "1993";
        break;
      case snNumeric >= 470770 && snNumeric <= 484400:
        response.year = "1994";
        break;
      case snNumeric >= 484401 && snNumeric <= 501470:
        response.year = "1995";
        break;
      case snNumeric >= 501471 && snNumeric <= 518689:
        response.year = "1996";
        break;
      case snNumeric >= 518690 && snNumeric <= 528368:
        response.year = "1997";
        break;
      case snNumeric >= 528369 && snNumeric <= 536826:
        response.year = "1998";
        break;
      case snNumeric >= 536827 && snNumeric <= 545890:
        response.year = "1999";
        break;
      case snNumeric >= 545891 && snNumeric <= 555979:
        response.year = "2000";
        break;
      case snNumeric >= 555980 && snNumeric <= 564478:
        response.year = "2001";
        break;
      case snNumeric >= 564479 && snNumeric <= 571883:
        response.year = "2002";
        break;
      case snNumeric >= 571884 && snNumeric <= 579654:
        response.year = "2003";
        break;
      case snNumeric >= 579655 && snNumeric <= 592919:
        response.year = "2004";
        break;
      case snNumeric >= 592920 && snNumeric <= 601450:
        response.year = "2005";
        break;
      case snNumeric >= 601451 && snNumeric <= 609566:
        response.year = "2006";
        break;
      case snNumeric >= 609567 && snNumeric <= 618494:
        response.year = "2007";
        break;
      case snNumeric >= 618495 && snNumeric <= 620263:
        response.year = "2008";
        break;
      case snNumeric >= 620264 && snNumeric <= 621209:
        response.year = "2009";
        break;
      case snNumeric >= 621210 && snNumeric <= 621981:
        response.year = "2010";
        break;
      case snNumeric >= 621982 && snNumeric <= 622147:
        response.year = "2011";
        break;
      case snNumeric >= 622148 && snNumeric <= 622419:
        response.year = "2012";
        break;
      case snNumeric >= 622420 && snNumeric <= 622539:
        response.year = "2013";
        break;
      default:
        break;
    }
  }
  if (brandId === "ADO") {
    switch (true) {
      case snNumeric >= 23764:
        response.year = "2013";
        break;
      case snNumeric >= 23592:
        response.year = "2012";
        break;
      case snNumeric >= 23403:
        response.year = "2011";
        break;
      case snNumeric >= 23156:
        response.year = "2010";
        break;
      case snNumeric >= 22879:
        response.year = "2009";
        break;
      case snNumeric >= 22523:
        response.year = "2008";
        break;
      case snNumeric >= 22212:
        response.year = "2007";
        break;
      case snNumeric >= 21515:
        response.year = "2006";
        break;
      case snNumeric >= 21086:
        response.year = "2005";
        break;
      case snNumeric >= 20803:
        response.year = "2004";
        break;
      case snNumeric >= 20041:
        response.year = "2003";
        break;
      case snNumeric >= 18962:
        response.year = "2002";
        break;
      case snNumeric >= 17394:
        response.year = "2001";
        break;
      case snNumeric >= 16137:
        response.year = "2000";
        break;
      case snNumeric >= 14624:
        response.year = "1999";
        break;
      case snNumeric >= 13021:
        response.year = "1998";
        break;
      case snNumeric >= 12449:
        response.year = "1997";
        break;
      case snNumeric >= 11214:
        response.year = "1996";
        break;
      case snNumeric >= 9779:
        response.year = "1995";
        break;
      case snNumeric >= 8160:
        response.year = "1994";
        break;
      case snNumeric >= 7089:
        response.year = "1993";
        break;
      case snNumeric >= 6279:
        response.year = "1992";
        break;
      case snNumeric >= 5542:
        response.year = "1991";
        break;
      case snNumeric >= 4975:
        response.year = "1990";
        break;
      case snNumeric >= 4697:
        response.year = "1989";
        break;
      case snNumeric >= 4428:
        response.year = "1988";
        break;
      case snNumeric >= 4284:
        response.year = "1987";
        break;
      case snNumeric >= 4252:
        response.year = "1986";
        break;
      case snNumeric >= 4110:
        response.year = "1985";
        break;
      case snNumeric >= 3860:
        response.year = "1984";
        break;
      case snNumeric >= 3243:
        response.year = "1983";
        break;
      case snNumeric >= 2669:
        response.year = "1982";
        break;
      case snNumeric >= 1671:
        response.year = "1981";
        break;
      case snNumeric >= 1059:
        response.year = "1980";
        break;
      case snNumeric >= 609:
        response.year = "1979";
        break;
      case snNumeric >= 100:
        response.year = "1978";
        break;
      case snNumeric >= 77:
        response.year = "1977";
        break;
      default:
        break;
    }
  }
  return response;
};
