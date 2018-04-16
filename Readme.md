# Purpose

To be the a very complete repository of stores that accept bitcoin through lightning.

# Domains

The following websites forward to www.lightningnetworkstores.github.io:

www.lightningnetworkstores.com

www.lightningnetworkshops.com

# Contributions
Contributions are welcome, I will give push access to who proves to be trustworthy or forward the registered domains to your forked website if it's open source and well maintained.

## How to add a store

### Mainnet store
Go to ```sites.json``` and add an entry with the folowing information:

    {
    "href": "the_website_of_the_store",
    "uri": "nodeID@IP:port" OR "unknown",
    "name": "name_of_the_store",
    "description": "small_description_of_the_store"
     }
     
Example entry:

    {
    "href": "https://mainnet.yalls.org/",
    "uri": "02669e1e43577c14a4ae796a38e0cfdadb548615058e367bd96bf825e62c0932ce@34.200.241.1:9735",
    "name": "Y'alls",
    "description": "Buy and sell articles with other members"
     },
     
 Fill the optional fields ``sector``, ``physical_delivery``, ``added`` and ``size``. The ``added`` field is the UNIX timestamp in seconds (seconds after 1st of January 1970) of thje current time (you can find it here https://www.epochconverter.com/).
 
 Hint: Careful with the commas, make sure your the new file has no syntax errors. Use https://jsonformatter.curiousconcept.com/ to check your changes.
 
 ### Testnet store
 Do the same but in the ```sitesTestnet.json``` file.
