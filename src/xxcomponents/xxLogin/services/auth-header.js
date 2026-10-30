export default function authHeader(){
    const user = JSON.parse(sessionStorage.getItem('user'));
    if(user && user.jwtToken){
        return {"Authorization":user.jwtToken};
    } else {
        return {};
    }
}



