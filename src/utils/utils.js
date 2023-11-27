/** @module utils */

export const getColWidth = width => {
  const xs = 12;
  let md = 0;
  let lg = 0;
  switch (width) {
    case "wide":
      md = 6;
      lg = 4;
      break;
    case "full":
      md = 12;
      lg = 12;
      break;
    default:
      md = 3;
      lg = 2;
  }
  return {
    xs,
    md,
    lg
  };
};

export const getUserName = user => {
  return user.firstname
    ? `${user.firstname} ${user.lastname ?? ""}`
    : user.username ?? "User";
};


/**
 * @function cookieFunctions
 * @description Object of two cookie functions: setCookie and getCookie
 */
export const cookieFunctions = {
  setCookie: (cname, cvalue, age) => {
    const d = new Date();
    d.setTime(d.getTime() + age * 24 * 60 * 60 * 1000);
    document.cookie = `${cname}=${cvalue};expires=${d.toUTCString()};path=/`;
  },
  getCookie: cname => {
    const name = `${cname}=`;
    const cookieArray = document.cookie.split(";");
    let requestedCookie = "";
    cookieArray.forEach(cookie => {
      const c = cookie.replace(/ /g, "");
      if (c.indexOf(name) === 0) {
        requestedCookie = c.substring(name.length, c.length);
      }
    });
    return requestedCookie;
  }
};