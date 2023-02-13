const pool = require("./db")

const findAll = () => {
    return pool.query(`SELECT lower(name) AS name, mobile, email FROM public.contacts ORDER BY name ASC; `) 
}

const findOne = async(name) =>{
    const find = (await pool.query(`SELECT * FROM contacts WHERE LOWER(name) = LOWER('${name}') `)).rows
    if(find.length>0){
        return true
    } else return false

}


const addContact = (datass) => {
    return pool.query(`INSERT INTO contacts VALUES('${datass.name}','${datass.email}','${datass.mobile}') RETURNING *`)
}

const deleteContact = (name) => {
    const lowName = name.toLowerCase()
    return pool.query(`DELETE FROM public.contacts WHERE name = '${lowName}'`)
}

const UpdateContact = async(oldname, name, email,mobile)=>{
    // console.log('abi',oldname);
    await pool.query(`UPDATE contacts SET name='${name}', email='${email}', mobile='${mobile}'
	WHERE name = '${oldname}'`)
}

module.exports ={findAll, addContact , findOne,deleteContact,UpdateContact}