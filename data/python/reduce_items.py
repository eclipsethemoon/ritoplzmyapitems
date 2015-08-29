from __future__ import division
from collections import Counter
import json

ap_items = map(str, [1026, 1052, 1058, 3001, 3003, 3023, 3025, 3027, 3041, 3057, 3060, 3078, 3089, 3100, 3108,
                     3113, 3115, 3116, 3124, 3135, 3136, 3145, 3146, 3151, 3152, 3157, 3165, 3174, 3191, 3285, 3504])
champs = map(str, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27,
                   28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 48, 50, 51, 53, 54, 55, 56,
                   57, 58, 59, 60, 61, 62, 63, 64, 67, 68, 69, 72, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86,
                   89, 90, 91, 92, 96, 98, 99, 101, 102, 103, 104, 105, 106, 107, 110, 111, 112, 113, 114, 115, 117,
                   119, 120, 121, 122, 126, 127, 131, 133, 134, 143, 150, 154, 157, 161, 201, 222, 236, 238, 245,
                   254, 266, 267, 268, 412, 421, 429, 432])
lanes = ["MIDDLE", "TOP", "JUNGLE", "BOTTOM"]
roles = ["DUO", "NONE", "SOLO", "DUO_CARRY", "DUO_SUPPORT"]
spells = map(str, [1, 2, 3, 4, 6, 7, 11, 12, 13, 14, 21])
spell_list = ['spell' + spell for spell in spells]  # for easier manipulation in production data
tiers = ["CHALLENGER", "MASTER", "DIAMOND", "PLATINUM", "GOLD", "SILVER", "BRONZE", "UNRANKED"]
champ_terms = ['winner', 'magicDamageDealt', 'magicDamageDealtToChampions', 'totalHeal', 'totalTimeCrowdControlDealt',
               'kills', 'deaths', 'assists'] + lanes + roles + tiers + ['spell' + spell for spell in spells] + \
              ['rylaiLiandry_count', 'rylaiLiandry_winner', 'rylaiLiandry_magicDamageDealt',
               'rylaiLiandry_magicDamageDealtToChampions', 'rylaiLiandry_totalTimeCrowdControlDealt'] + \
              ['nlr_count', 'nlr_winner', 'nlr_timestamp', 'fiendish_count', 'fiendish_winner', 'fiendish_timestamp']
terms = ['winner', 'magicDamageDealt', 'magicDamageDealtToChampions', 'totalHeal', 'totalTimeCrowdControlDealt',
         'kills', 'deaths', 'assists', 'timestamp'] + lanes + roles + tiers + ['spell' + spell for spell in spells]

# Group terms to know operation that needs to be performed on them
champ_group_count_terms = ['winner', 'magicDamageDealt', 'magicDamageDealtToChampions', 'totalHeal',
                           'totalTimeCrowdControlDealt', 'kills', 'deaths', 'assists'] + lanes + roles + tiers + \
                          ['spell' + spell for spell in spells]
group_count_terms = ['winner', 'magicDamageDealt', 'magicDamageDealtToChampions', 'totalHeal',
                     'totalTimeCrowdControlDealt', 'kills', 'deaths', 'assists', 'timestamp'] + lanes + roles + \
                    tiers + ['spell' + spell for spell in spells]


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
    total_ap_players = 0

    # Reduce the summary data
    for patch in patches:
        # Create a huge file of all accumulated data for all regions and types
        item_total = Counter()
        for region in regions:
            item_total.update(reduce_region(patch, region))
        with open('json/reduced/' + patch + '.json', 'w') as f:
            json.dump(dict(item_total), f)

        # Create item-centric data
        item_json = dict()
        for ap_item in ap_items:
            item_json[ap_item] = dict()
            item_json[ap_item]['summary'] = Counter()
            for champ in champs:
                item_json[ap_item][champ] = dict()
                item_json[ap_item][champ]['count'] = item_total['_'.join([ap_item, champ])]
                for term in terms:
                    item_json[ap_item][champ][term] = item_total['_'.join([ap_item, champ, term])]
                item_json[ap_item]['summary'].update(item_json[ap_item][champ])
            item_json[ap_item]['summary']['count'] = item_total[ap_item]
            with open('json/items/' + ap_item + '_' + patch + '.json', 'w') as f:
                json.dump(item_json[ap_item], f)

        # Create item-centric data
        champ_json = dict()
        for champ in champs:
            champ_json[champ] = dict()
            champ_json[champ]['summary'] = dict()
            champ_json[champ]['summary']['count'] = item_total[champ]
            for term in champ_terms:
                champ_json[champ]['summary'][term] = item_total['_'.join([champ, term])]
            for ap_item in ap_items:
                champ_json[champ][ap_item] = dict()
                champ_json[champ][ap_item]['count'] = item_total['_'.join([ap_item, champ])]
                for term in terms:
                    champ_json[champ][ap_item][term] = item_total['_'.join([ap_item, champ, term])]
            total_ap_players += item_total[champ]
            with open('json/champions/' + champ + '_' + patch + '.json', 'w') as f:
                json.dump(champ_json[champ], f)

        # Create item values for the website
        for ap_item in ap_items:
            site_item = item_json[ap_item]
            site_item_summary_count = site_item['summary']['count']
            site_item['summary']['pickRate'] = site_item_summary_count / total_ap_players
            for g_term in group_count_terms:
                site_item['summary'][g_term] /= site_item_summary_count
            # Repeat summary steps to each champ
            for champ in champs:
                site_item_champ_count = site_item[champ]['count']
                site_item[champ]['pickRate'] = site_item_champ_count / site_item_summary_count
                if site_item_champ_count == 0:  # This shouldn't be needed since it defaults to 0, but just in case
                    for g_term in group_count_terms:
                        site_item[champ][g_term] = 0
                else:
                    for g_term in group_count_terms:
                        site_item[champ][g_term] /= site_item_champ_count
            with open('json/production/' + ap_item + '_' + patch + '.json', 'w') as f:
                json.dump(site_item, f)

        # Create item values for the website
        for champ in champs:
            site_champ = champ_json[champ]
            site_champ_summary_count = site_champ['summary']['count']
            site_champ['summary']['pickRate'] = site_champ_summary_count / total_ap_players

            # Format RylaiLiandry terms
            rylaiLiandryCount = site_champ['summary']['rylaiLiandry_count']
            site_champ['summary']['rylaiLiandry_pickRate'] = rylaiLiandryCount / site_champ_summary_count
            if rylaiLiandryCount != 0:
                site_champ['summary']['rylaiLiandry_winner'] /= rylaiLiandryCount
                site_champ['summary']['rylaiLiandry_magicDamageDealt'] /= rylaiLiandryCount
                site_champ['summary']['rylaiLiandry_magicDamageDealtToChampions'] /= rylaiLiandryCount
                site_champ['summary']['rylaiLiandry_totalTimeCrowdControlDealt'] /= rylaiLiandryCount

            # Format NLR and Fiendish terms
            nlrCount = site_champ['summary']['nlr_count']
            fiendishCount = site_champ['summary']['fiendish_count']
            site_champ['summary']['nlr_pickRate'] = nlrCount / site_champ_summary_count
            site_champ['summary']['fiendish_pickRate'] = fiendishCount / site_champ_summary_count
            if nlrCount != 0:
                site_champ['summary']['nlr_winner'] /= nlrCount
                site_champ['summary']['nlr_timestamp'] /= nlrCount
            if fiendishCount != 0:
                site_champ['summary']['fiendish_winner'] /= fiendishCount
                site_champ['summary']['fiendish_timestamp'] /= fiendishCount

            # Average the rest of the terms related to the champ
            for g_term in champ_group_count_terms:
                site_champ['summary'][g_term] /= site_champ_summary_count

            ap_item_count_json = dict()
            ap_item_winner_json = dict()
            for ap_item in ap_items:
                site_champ_item_count = site_champ[ap_item]['count']
                site_champ[ap_item]['pickRate'] = site_champ_item_count / site_champ_summary_count
                if site_champ_item_count == 0:  # This shouldn't be needed since it defaults to 0, but just in case
                    for g_term in group_count_terms:
                        site_champ[ap_item][g_term] = 0
                else:
                    for g_term in group_count_terms:
                        site_champ[ap_item][g_term] /= site_champ_item_count
                ap_item_count_json[ap_item] = site_champ[ap_item]['pickRate']
                ap_item_winner_json[ap_item] = site_champ[ap_item]['winner']

            # Add array of sorted items with highest pick and winrate
            site_champ['summary']['most_common_items'] = \
                sorted(ap_item_count_json, key=ap_item_count_json.get, reverse=True)
            site_champ['summary']['most_winner_items'] = \
                sorted(ap_item_winner_json, key=ap_item_winner_json.get, reverse=True)
            with open('json/production/' + champ + '_' + patch + '.json', 'w') as f:
                json.dump(site_champ, f)
