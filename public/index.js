let form = document.querySelector("#form");
form.addEventListener("submit", async(event)=>{
    event.preventDefault();
    let contactName = document.querySelector("#contact_name");
    let email = document.querySelector("#email")
    let response = await fetch("http://localhost:5001",
    {
        mode: "no-cors",
        redirect: "follow",
        headers: {"content-type": "application/json"},
        method: "POST",
        body: JSON.stringify({contact_name, email})
    });
    let msg = await response.json()
    console.log(msg)
})