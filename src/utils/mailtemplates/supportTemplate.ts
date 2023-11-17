export const getTemplate = (name, data) => {
    switch (name) {
        case "support":
            return (`<body>
            <div>   
            <span>Dear Evervent Team,<br><br>  
            We require assistance with the integration between Broker Portal and your technology. Please find the essential details below:<br><br>
            <span>Issue Category : <b>${data.reasons}</b><br>
            Description&nbsp;&nbsp;&nbsp;: <b>${data.description}</b>
            <br><br> 
            <span> Kindly provide prompt attention to this support ticket. We appreciate your assistance in resolving the issue and achieving a smooth integration.<br><br><br>
            Thank you,<br>
            ${data.username}<br>
            ${data.organisationName}
        </span>  
        <br><br>   
            </div>
            
            </body>
                `)
            break;
        default:
            return
            break;
    }

}