# Purpose

The lightning network is growing and people don't know how to spend their bitcoin using lightning. Therefore I started this simple website hosted in github pages that lists the stores that I knew. 

# Domains

The following websites forward to www.lightningnetworkstores.github.io:

www.lightningnetworkstores.com

www.lightningnetworkshops.com

# Contributions
Contributions are welcome, I will even give pull/merge permissions to who proves to be trustworthy or forward the registered domains to your forked website if it's open source and well maintained.

## How to add a store

### Mainnet store
Go to ```sites.json``` and add an entry with the folowing information:

    "Last_index+1": {
    "href": "the_website_of_the_store",
    "uri": "nodeID@IP:port" OR "unknown",
    "name": "name_of_the_store",
    "description": "small_description_of_the_store"
     }
     
Example entry:

    "2": {
    "href": "https://mainnet.yalls.org/",
    "uri": "02669e1e43577c14a4ae796a38e0cfdadb548615058e367bd96bf825e62c0932ce@34.200.241.1:9735",
    "name": "Y'alls",
    "description": "Buy and sell articles with other members"
     },
     
 ### Testnet store
 Do the same but in the ```sitesTestnet.json``` file.
