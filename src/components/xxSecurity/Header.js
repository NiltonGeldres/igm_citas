export default function header(){
    const user = JSON.parse(sessionStorage.getItem('user'));
    if(user && user.jwtToken){
        return {"Authorization":'Bearer '+user.jwtToken};
    } else {
        return {};
    }
}