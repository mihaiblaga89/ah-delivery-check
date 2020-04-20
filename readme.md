## Albert Heijn Delivery Check

Checks Albert Heijn delivery slots by postcode, in this time of need, without having to access AH's website and scroll the calendar.

`npm install -g @mihaiblaga89/ah-delivery` 
`ahdl check <postcode>`

or `npx @mihaiblaga89/ah-delivery check <postcode>`

### Options
`-c, --cron` - Will exit with an exit code of 1 (error) if it finds something. Made specifically for my Synology NAS since I can easily set it up with a few clicks to send me an email if a cronjob fails. That way I can enable this to run every 10 minutes and I'll receive an email if it finds a slot. 

`-l, --limit <days>` - You can limit the number of days you want this script to check. Maybe you're not interested in slots 10 days from now. 
