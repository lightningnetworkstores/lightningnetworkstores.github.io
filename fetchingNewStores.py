# this script looks at the names of the nodes, detects those that have a name for a website and tries to open the website.
# if a positive response is obtained, this might be a new store :)

import requests
import re

# needs to be improved with https://www.robtex.com/lightning/node/?sort=-discovered
nodes = requests.get('https://shabang.io/nodes.json')

if nodes.status_code != 200:
    exit()
nodes = nodes.json()
nodes = nodes['nodes']

nodenames = [x['alias'] for x in nodes if 'alias' in x.keys()]

pattern = '[a-zA-Z]{2,}\.{1}[a-zA-Z]{2,3}'
selection = [x for x in nodenames if re.match(pattern,x)!=None]
selection = [x.replace('?',"") for x in selection]
selection = [x.replace(' ',"") for x in selection]

old = ['fdisk.ln.node', 'btc.lnetwork.tokyo', 'CryptoAdvisoryGroup.io', 'opennode.co', 'Ionic.Release', 'ozupek.com.tr', 'ZAP.COOL', 'forkliner.com', 'mn.lnd.lightning.rip', 'store.edberg.eu', 'LND.rompert.com', 'QR.CR', 'martijnbolt.com', 'BX.in.th', 'resharesat.com', 'mainnet.yalls.org', 'elec.luggs.co', 'BitStarz.com', 'ln.mempool.co', 'Billfodl.com', 'cryptonoobs.club', 'backup.bbt.tc', 'lncast.com', 'CoinMall.com', 'lnhub.us', 'CL.rompert.com', 'cybergeld.info', 'embedded.cash', 'LNTURKEY.NET', 'BitBargain.co.uk', 'Ionic.Release', 'lightning.exposed', 'lightningpay.me', 'ln.inazuma.cc', 'Stadicus.com', 'ln.bbt.tc', 'BitBargain.co.uk', 'distributed.love', 'the.lightning.land', 'elec.luggs.co', 'FOURLEAF.life', 'livingroomofsatoshi.com', 'mainnet.lnd.resdat', 'quantumgear.io', 'ln.heimburg.se', 'inabottle.io', 'BHB.network', 'ln.keff.org', 'BitBargain.co.uk', 'john.zweng.at', 'lightstorm.cc', 'mainnet.yalls.org', 'lightning.nicolas-dorier.com', 'SQUADSYSTEM.COM', 'ln.hkjn.me', 'POOLIN.COM', 'TokenSoft.io', 'hodl.me.2nyt', 'zbiornik.com', 'coinfinity.co', 'COINMINER.SPACE', 'PARK.IO', 'lnd.rows.io', 'ln.google.com', 'aspinall.io', 'ASTERIOS.TM', 'bitcoin.co', 'gnet.me', 'lightningramp.com', 'thunder.node', 'BIGHT.nl', 'refractionx.com']
old2 = ['inabottle.io', 'ZAP.COOL', 'BitBargain.co.uk', 'ln.mallorn.de', 'ln.taborsky.cz', 'Bight.nl', 'ln.vanovcan.net', 'resharesat.com', 'rompert.com', 'Billfodl.com', 'freedomnode.com', 'DatPay.Me', 'COINMINER.SPACE', 'bitmynt.no', 'POOLIN.COM', 'LightningPay.me', 'BitStarz.com', 'BitBargain.co.uk', 'skyrus.net', 'LEVENTGUNAY.COM', 'inazuma.cc', 'distributed.love', 'lightningbtc.shop', 'skyrus.net', 'lightstorm.cc', 'LivingRoomOfSatoshi.com', 'ln.mempool.co', 'matt.drollette.com', 'BTC.NETWORK', 'bitcoinsupermarkt.de', 'quantumgear.io', 'arihanc.com', 'TheCrypto.City', 'mainnet.yalls.org', 'cryptohead.de', 'BX.in.th', 'embedded.cash', 'lnstat.ideoflux.com', 'btcpay.cash', 'tondro.club', 'cryptopolitics.global', 'PARK.IO', 'mainnet.yalls.org', 'BubbleCoin.lol', 'lngate.tokyo', 'john.zweng.at', 'zbiornik.com', 'martijnbolt.com', 'cybergeld.info', 'TokenSoft.io', 'revealer.cc', 'DavinciCodes.net', 'www.bankofcrypto.info', 'tanjalo.com', 'mainnet.yalls.org', 'ASTERIOS.TM', 'BHB.network', 'FOURLEAF.life', 'zap.wizb.it', 'SQUADSYSTEM.COM', 'CoinMall.com', 'gnet.me', 'graph.lndexplorer.com', 'BitBargain.co.uk', 'QR.CR', 'bitfree.io', 'ln.hkjn.me', 'Waldo.fun', 'CryptoAdvisoryGroup.io', 'coinpanic.com', 'shop.sprovoost.nl']
old3 = old+old2+['ozupek.com.tr', 'startln.com', 'forkliner.com', 'bankless.io', 'BTC.COM', 'lncast.com', 'HodlMonkey.com']
old4 = old3 + ['masteringlightning.com', 'LivingRoomofSatoshi.com', 'mottods.com', 'lightningshop.eu', 'Grunch.fun', 'lightningnode.cz', 'Bitrefill.com', 'Byteball.be', 'moneyclub.network']

newSelection = []
for site in selection:
    if site not in old4:
        try:
            response = requests.get('http://'+site,timeout=7)
            if response.status_code == 200:
                newSelection.append(site)
        except:
            pass





for site in newSelection:
    print(site)