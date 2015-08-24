import json
from collections import Counter

ap_items = map(str, [1026, 1052, 1058, 3001, 3003, 3023, 3025, 3027, 3040, 3041, 3057, 3060, 3078, 3089, 3100, 3108,
                     3113, 3115, 3116, 3124, 3135, 3136, 3145, 3146, 3151, 3152, 3157, 3165, 3174, 3191, 3285, 3504])
champs = map(str, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27,
                   28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 48, 50, 51, 53, 54, 55, 56,
                   57, 58, 59, 60, 61, 62, 63, 64, 67, 68, 69, 72, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86,
                   89, 90, 91, 92, 96, 98, 99, 101, 102, 103, 104, 105, 106, 107, 110, 111, 112, 113, 114, 115, 117,
                   119, 120, 121, 122, 126, 127, 131, 133, 134, 143, 150, 154, 157, 161, 201, 222, 223, 236, 238, 245,
                   254, 266, 267, 268, 412, 421, 429, 432])
lanes = ["MID", "MIDDLE", "TOP", "JUNGLE", "BOT", "BOTTOM"]
roles = ["DUO", "NONE", "SOLO", "DUO_CARRY", "DUO_SUPPORT"]
spells = map(str, [1, 2, 3, 4, 6, 7, 11, 12, 13, 14, 21])
tiers = ["CHALLENGER", "MASTER", "DIAMOND", "PLATINUM", "GOLD", "SILVER", "BRONZE", "UNRANKED"]
terms = ['winner', 'magicDamageDealt', 'magicDamageDealtToChampions', 'totalTimeCrowdControlDealt', 'kills', 'deaths',
         'assists', 'timestamp'] + lanes + roles + tiers + ['spell' + spell for spell in spells]


# Accumulate data from each region
def reduce_region(p, r):
    match_types = ['NORMAL_5X5', 'RANKED_SOLO']
    item_counter = Counter()
    for match in match_types:
        with open('json/processed/' + '_'.join([r, match, p]) + '.json', 'r') as region_f:
            item_counter.update(json.load(region_f))
    with open('json/reduced/' + '_'.join([r, p]) + '.json', 'w') as region_f:
        json.dump(dict(item_counter), region_f)
    return dict(item_counter)


if __name__ == "__main__":
    patches = ['5.11', '5.14']
    regions = ['BR', 'EUNE', 'EUW', 'KR', 'LAN', 'LAS', 'NA', 'OCE', 'RU', 'TR']

    # Reduce the summary data
    for patch in patches:
        # Create a huge file of all accumulated data for all regions and types
        item_total = Counter()
        for region in regions:
            item_total.update(reduce_region(patch, region))
        with open('json/reduced/' + patch + '.json', 'w') as f:
            json.dump(dict(item_total), f)

        # Create item-centric data
        for ap_item in ap_items:
            item_json = dict()
            item_json[ap_item] = dict()
            item_json[ap_item]['summary'] = Counter()
            for champ in champs:
                item_json[ap_item][champ] = dict()
                for term in terms:
                    item_json[ap_item][champ][term] = item_total['_'.join([ap_item, champ, term])]
                item_json[ap_item]['summary'].update(item_json[ap_item][champ])
            with open('json/items/' + ap_item + '_' + patch + '.json') as f:
                json.dump(item_json[ap_item], f)


    # Create item and champion specific data

    # # Create item-specific
    # for ap_item in ap_items:
    #     ap_item_dict = dict()
    #     for patch in patches:
    #         with open('json/processed/' + patch + '.json', 'r') as f:
    #             data = json.load(f)
    #             ap_item_dict['count'] = data[ap_item]
    #             ap_item_dict['count_percent'] = data[ap_item] / data[ap_item + ]
    #             ap_item_dict['winner'] = data['']
    #             for champ in champs:
    #                 ap_item_dict[]
    #         with open('json/items/' + ap_item + '/' + patch + '.json', 'w') as f:
    #             json.dump(dict(item_total), f)
    #
    #
    #         #     relevant_items[champ] = 0  # SMW: I know this is duplicated, but this is just initialization
    #         # relevant_items['_'.join([item, champ])] = 0
    #         # relevant_items['_'.join([item, champ, 'winner'])] = 0
    #         # relevant_items['_'.join([item, champ, 'magicDamageDealt'])] = 0
    #         # relevant_items['_'.join([item, champ, 'magicDamageDealtToChampions'])] = 0
    #         # relevant_items['_'.join([item, champ, 'totalTimeCrowdControlDealt'])] = 0
    #         # relevant_items['_'.join([item, champ, 'kills'])] = 0
    #         # relevant_items['_'.join([item, champ, 'deaths'])] = 0
    #         # relevant_items['_'.join([item, champ, 'assists'])] = 0
    #         # relevant_items['_'.join([item, champ, 'timestamp'])] = 0
    #         # for tier in tiers:
    #         #     relevant_items['_'.join([item, champ, tier])] = 0
    #         # for lane in lanes:
    #         #     relevant_items['_'.join([item, champ, lane])] = 0
    #         # for role in roles:
    #         #     relevant_items['_'.join([item, champ, role])] = 0
    #         # for spell in spells:
    #         #     relevant_items['_'.join([item, champ, 'spell' + spell])] = 0
    #
    # # Create champion-specific
    # for champ in champs:
