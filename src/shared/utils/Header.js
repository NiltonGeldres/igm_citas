export default function header(){
    const token = JSON.parse(sessionStorage.getItem('token_data'));
    if(token && token.jwtToken){
        return {"Authorization":'Bearer '+token.jwtToken};
    } else {
        return {};
    }
}