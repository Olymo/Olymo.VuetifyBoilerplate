export const isAuthorized = () => {
    if(!localStorage.getItem("tokens")) {
        return false;
    }

    let accessToken = decodeJwtToken();

    if (Date.now() >= accessToken.exp * 1000) {
        return false;
    }

    return true;

}

export const decodeJwtToken = () => {
    if(!localStorage.getItem("tokens")) {
        return null;
    }

    var tokens = JSON.parse(localStorage.getItem("tokens")); 

    var accessToken = tokens.accessToken;

    var userClaimData = accessToken.split(".")[1];
    var claimObject = JSON.parse(atob(userClaimData));

    return claimObject;
}

// const getRefreshToken = () =>
//   localStorage.getItem("tokens") != null
//     ? JSON.parse(localStorage.getItem("tokens")).refreshToken
//     : "";

export const getActorData = () => {
    if(!localStorage.getItem("tokens")) {
        return null;
    }

    var tokens = JSON.parse(localStorage.getItem("tokens")); 

    var accessToken = tokens.accessToken;

    var userClaimData = accessToken.split(".")[1];
    var claimObject = JSON.parse(atob(userClaimData));
    
    var actorData = JSON.parse(claimObject.UserData);

    return actorData;
    //localStorage.setItem("actorData", JSON.stringify(actorData));
}

