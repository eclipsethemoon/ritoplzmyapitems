from __future__ import division
import json
import requests
import yaml

ap_items = map(str, [1026, 1052, 1058, 3001, 3003, 3023, 3025, 3027, 3041, 3057, 3060, 3078, 3089, 3100, 3108,
                     3113, 3115, 3116, 3124, 3135, 3136, 3145, 3146, 3151, 3152, 3157, 3165, 3174, 3191, 3285, 3504])
champs = map(str, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27,
                   28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 48, 50, 51, 53, 54, 55, 56,
                   57, 58, 59, 60, 61, 62, 63, 64, 67, 68, 69, 72, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86,
                   89, 90, 91, 92, 96, 98, 99, 101, 102, 103, 104, 105, 106, 107, 110, 111, 112, 113, 114, 115, 117,
                   119, 120, 121, 122, 126, 127, 131, 133, 134, 143, 150, 154, 157, 161, 201, 222, 236, 238, 245,
                   254, 266, 267, 268, 412, 421, 429, 432])


if __name__ == "__main__":
    patches = ['5.11', '5.14']

    with open('conf/application.yml', 'r') as f:
        config = yaml.load(f)

    league_items = dict()
    item_types = set()
    for ap_item in ap_items:
        league_items[ap_item] = dict()
        res = requests.get('https://global.api.pvp.net/api/lol/static-data/na/v1.2/item/' +
                           ap_item + '?itemData=tags&api_key=' + config['dev_api_key'])
        if res.status_code == 200:
            league_items[ap_item] = json.loads(res.content)
            item_types.update(league_items[ap_item]['tags'])
        else:
            print('NOT 200 APPEARED')

    league_champs = dict()
    for champ in champs:
        league_champs[champ] = dict()
        res = requests.get('https://global.api.pvp.net/api/lol/static-data/na/v1.2/champion/' +
                           champ + '?champData=stats,tags&api_key=' + config['dev_api_key'])
        if res.status_code == 200:
            league_champs[champ] = json.loads(res.content)
        else:
            print('NOT 200 APPEARED')

    # Create the JSON for the item-summary/front page
    items = []
    for ap_item in ap_items:
        ap_item_dict = dict()
        ap_item_dict['id'] = ap_item
        ap_item_dict['plaintext'] = league_items[ap_item]['plaintext']
        ap_item_dict['description'] = league_items[ap_item]['description']
        ap_item_dict['name'] = league_items[ap_item]['name']
        ap_item_dict['tags'] = league_items[ap_item]['tags']
        for patch in patches:
            ap_item_dict[patch] = dict()
            with open('json/production/' + '_'.join([ap_item, patch]) + '.json', 'r') as f:
                item_stats = json.load(f)
                ap_item_dict[patch] = item_stats['summary']
        items.append(ap_item_dict.copy())
    with open('../items.json', 'w') as f:
        json.dump(items, f)

    # Create the JSON for items in a champion page
    for champ in champs:
        champ_items = dict()
        champ_items['id'] = champ
        champ_items['key'] = league_champs[champ]['key']
        champ_items['name'] = league_champs[champ]['name']
        champ_items['title'] = league_champs[champ]['title']
        champ_items['stats'] = league_champs[champ]['stats']
        champ_items['tags'] = league_champs[champ]['tags']
        champ_items['item_types'] = dict()
        for patch in patches:
            champ_items['item_types'][patch] = dict()
            for item_type in item_types:
                champ_items['item_types'][patch][item_type] = 0
        for ap_item in ap_items:
            champ_items[ap_item] = dict()
            champ_items[ap_item]['id'] = ap_item
            champ_items[ap_item]['plaintext'] = league_items[ap_item]['plaintext']
            champ_items[ap_item]['description'] = league_items[ap_item]['description']
            champ_items[ap_item]['name'] = league_items[ap_item]['name']
            champ_items[ap_item]['tags'] = league_items[ap_item]['tags']
            for patch in patches:
                champ_items[ap_item][patch] = dict()
                with open('json/production/' + '_'.join([champ, patch]) + '.json', 'r') as f:
                    item_stats = json.load(f)
                    champ_items[ap_item][patch] = item_stats[ap_item]
                    for tag in champ_items[ap_item]['tags']:
                        champ_items['item_types'][patch][tag] += item_stats[ap_item]['count']
        with open('../' + champ + '.json', 'w') as f:
            json.dump(champ_items, f)

    # Create the JSON for the champion-summary/front page
    champions = []
    for champ in champs:
        champ_dict = dict()
        champ_dict['id'] = champ
        champ_dict['key'] = league_champs[champ]['key']
        champ_dict['name'] = league_champs[champ]['name']
        champ_dict['title'] = league_champs[champ]['title']
        champ_dict['stats'] = league_champs[champ]['stats']
        champ_dict['tags'] = league_champs[champ]['tags']
        for patch in patches:
            champ_dict[patch] = dict()
            with open('json/production/' + '_'.join([champ, patch]) + '.json', 'r') as f:
                champ_stats = json.load(f)
                champ_dict[patch] = champ_stats['summary']
        champions.append(champ_dict.copy())
    with open('../champions.json', 'w') as f:
        json.dump(champions, f)

    # Create the JSON for champions in an item page
    for ap_item in ap_items:
        item_champs = dict()
        item_champs['id'] = ap_item
        item_champs['plaintext'] = league_items[ap_item]['plaintext']
        item_champs['description'] = league_items[ap_item]['description']
        item_champs['name'] = league_items[ap_item]['name']
        item_champs['tags'] = league_items[ap_item]['tags']
        for champ in champs:
            item_champs[champ] = dict()
            item_champs[champ]['id'] = champ
            item_champs[champ]['key'] = league_champs[champ]['key']
            item_champs[champ]['name'] = league_champs[champ]['name']
            item_champs[champ]['title'] = league_champs[champ]['title']
            item_champs[champ]['tags'] = league_champs[champ]['tags']
            for patch in patches:
                item_champs[champ][patch] = dict()
                with open('json/production/' + '_'.join([ap_item, patch]) + '.json', 'r') as f:
                    champ_stats = json.load(f)
                    item_champs[champ][patch] = champ_stats[champ]
        with open('../' + ap_item + '.json', 'w') as f:
            json.dump(item_champs, f)