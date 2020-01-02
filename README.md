# Purpose

This repository contains the front-end code of https://lightningnetworkstores.com - the most comprehensive directory of stores that accept bitcoin through lightning. The server fetches some files from this repository - including sites.json, wallets.json, services.json and donationAdresses.json. A pull request to one of these files will therefore affect what is seen on the website.

Please check the redesign branch which currently has the most recent code.

# FAQ and contact information

Please visit: https://lightningnetworkstores.com/about

# Contributions

## How to add a wallet
 
 Go to ```wallets.json``` and add an entry with information like in this example:
 
     {
        "name":"eclair wallet",
        "page":"https://github.com/ACINQ/eclair-wallet",
        "android":"https://play.google.com/store/apps/details?id=fr.acinq.eclair.wallet.mainnet2&hl=en",
        "android_testnet":"https://play.google.com/store/apps/details?id=fr.acinq.eclair.wallet&hl=en",
        "open_source":"https://github.com/ACINQ/eclair-wallet",
        "release":"April 2018"
      }

There can be missing information in the entry except for ```name``` and ```page```.

## How to add a store

Should be done using the button on the bottom right corner of the main page that says with a (+) sign. If you don't want to pay the listing fee you can contact us and we may add your website for free or, if you are a trusted member of the community, give you a code that will allow you to add any store for free. 

As a last resource, a pull request can be made:

### Mainnet store
Go to ```sites.json``` and add an entry with the folowing information:

    {
    "href": "the_website_of_the_store",
    "uri": "nodeID@IP:port" OR "unknown",
    "name": "name_of_the_store",
    "description": "small_description_of_the_store",
    "sector": choose from: technology/security/clothing/exchange/food/games&casino/other (new sectors also welcome),
    "digital_goods":choose from yes/no, goods shipped/no, goods only in-store,
    "added":unix_timestamp
     }
     
Example entry:

    {  
      "id":4,
      "href":"https://mainnet.yalls.org/",
      "uri":"03e50492eab4107a773141bb419e107bda3de3d55652e6e1a41225f06a0bbf2d56@mainnet-lnd.yalls.org",
      "name":"Y'alls",
      "description":"Buy and sell articles with other members",
      "sector":"other",
      "digital_goods":"yes",
      "added":1519419592
   }
     
 The ``added`` field is the UNIX timestamp in seconds (seconds after 1st of January 1970) of thje current time (you can find it here https://www.epochconverter.com/). New sectors can be added later, so feel free to put another new sector
 
 Hint: Careful with the commas, make sure your the new file has no syntax errors. Use https://jsonformatter.curiousconcept.com/ to check your changes.

