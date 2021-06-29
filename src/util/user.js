import httpClient from './httpClient';
import { getRefreshToken } from './httpClient';

export const isAuthorized = () => {
    if(!localStorage.getItem("tokens")) {
        return false;
    }

    // prvo proveriti da li je "exp" prosao, pa ako nije onda slati zahtev
    httpClient.get("api/account/CheckAuthorization")
        .then(res => {
            console.log(res);
            console.log("Upada u success");

            // ne mogu da vratim true, uvek vraca undefined jer je asinhrono
            return true;
        })
        .catch(err => {
            if(err.response.status == 401) {
                var refreshToken = getRefreshToken();

                httpClient.post("api/account/RefreshToken", {refreshToken})
                    .then(res => {
                        localStorage.setItem("tokens", JSON.stringify(res.data));
                        // sta ovde da vratim kada sam dobio nove tokene

                        console.log("Upada u then refresh token zahteva");

                        return true;
                    })
                    .catch(err => {
                        console.log(err);
                        console.log("Upada u catch refresh token zahteva");

                        localStorage.removeItem("tokens");

                        return false;
                    });
            } else {
                console.log("Druga err.response status");

            }
        });

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

