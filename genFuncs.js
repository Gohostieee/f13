import CryptoJS from 'crypto-js'
function validEmail (email) {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};
export function hash256(x){
	return CryptoJS.SHA256(x).toString(CryptoJS.enc.Base64)
}
export function utf8Enc(string){
	const words = CryptoJS.enc.Utf8.parse(string);

    return CryptoJS.enc.Base64.stringify(words);
}
//CryptoJS.enc.Utf8.parse("𔭢");
export function utf8Dec(utf8){
	 const words = CryptoJS.enc.Base64.parse(utf8);
   return words.toString(CryptoJS.enc.Utf8);
}
export default function accPost(con,params,callback) {
	let check,query;
	console.log(params)
	if (params['username'] < 1) {
		callback([400,{"reason":"userShort"}])
		return;		
	}
	if (params['password'] < 6) {
		callback([400,{"reason":"passShort"}])
		return;		
	} 
	
	
	switch(params['request']){
		
		case 'signup':
			if (!validEmail(params['email'])){
				callback([400,{"reason":"invalidEmail"}])
				return; 
			}
			if (params['email'] < 6) {
					callback([400,{"reason":"invalidEmail"}])
				return;
			}
			check = con.format("SELECT * FROM userLogins WHERE name = ?",params['username'])
			console.log(check)
			con.query(check,(e,v)=>{
				console.log(e,v)
				if(v.length===0){
					query = con.format("INSERT INTO userLogins (name, pass, email) VALUES (? ,?, ?)",[params['username'],hash256(params['password']),params['email']])
					con.query(query) 
					
					console.log("account gone through")
					callback([200,{}])
				}else{
					callback([400,{"reason":"userTaken"}])
				}
			})




		break;
		default:
			
			check = con.format("SELECT * FROM userLogins WHERE name = ?",params['username'])
			con.query(check,(e,v)=>{
				if(v.length===0){
					callback([400,{"reason":"userNotFound"}])
				}else{
					check = con.format("SELECT * FROM userLogins WHERE name = ? AND pass = ? ",[params['username'],hash256(params['password'] )])
					con.query(check,(e,value)=>{
						console.log(e,value)
						if(value.length===0){
							callback([400,{"reason":"passNotFound"}])
						}else{
							callback([200,{"reason":"userFound"}])

						}
					})
				}
			})






		break;
	}
	


}