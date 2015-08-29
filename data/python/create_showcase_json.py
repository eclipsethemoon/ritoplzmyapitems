from __future__ import division
import json

champs = map(str, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27,
                   28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 48, 50, 51, 53, 54, 55, 56,
                   57, 58, 59, 60, 61, 62, 63, 64, 67, 68, 69, 72, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86,
                   89, 90, 91, 92, 96, 98, 99, 101, 102, 103, 104, 105, 106, 107, 110, 111, 112, 113, 114, 115, 117,
                   119, 120, 121, 122, 126, 127, 131, 133, 134, 143, 150, 154, 157, 161, 201, 222, 236, 238, 245,
                   254, 266, 267, 268, 412, 421, 429, 432])


if __name__ == "__main__":
    patches = ['5.11', '5.14']

    # Redo champions json since we don't want an array and we're only runnig this once
    champions = dict()
    for champ in champs:
        champ_dict = dict()
        for patch in patches:
            champ_dict[patch] = dict()
            with open('json/production/' + '_'.join([champ, patch]) + '.json', 'r') as f:
                champ_stats = json.load(f)
                champ_dict[patch] = champ_stats['summary']
        champions[champ] = champ_dict

    # Create the JSON for the showcase cards
    count_json = dict()
    showcase = dict()
    for champ in champs:
        count_json[champ] = dict()
        showcase[champ] = dict()
        with open('../' + champ + '.json', 'r') as f:
            champ_json = json.load(f)
        for patch in patches:
            # Get the counts
            count_json[champ][patch] = dict()
            count_json[champ][patch]['count'] = champions[champ][patch]['count']
            count_json[champ][patch]['nashor_count'] = champ_json['3115'][patch]['count']
            count_json[champ][patch]['nashor_winner'] = \
                champ_json['3115'][patch]['count'] * champ_json['3115'][patch]['winner']
            count_json[champ][patch]['wota_count'] = champ_json['3152'][patch]['count']
            count_json[champ][patch]['wota_winner'] = \
                champ_json['3152'][patch]['count'] * champ_json['3152'][patch]['winner']
            count_json[champ][patch]['wota_totalHeal'] = \
                champ_json['3152'][patch]['count'] * champ_json['3152'][patch]['totalHeal']
            count_json[champ][patch]['rylaiLiandry_count'] = champions[champ][patch]['rylaiLiandry_count']
            count_json[champ][patch]['rylaiLiandry_winner'] = \
                champions[champ][patch]['rylaiLiandry_count'] * champions[champ][patch]['rylaiLiandry_winner']
            count_json[champ][patch]['rylaiLiandry_magicDamageDealtToChampions'] = \
                champions[champ][patch]['rylaiLiandry_count'] * \
                champions[champ][patch]['rylaiLiandry_magicDamageDealtToChampions']
            count_json[champ][patch]['rylaiLiandry_totalTimeCrowdControlDealt'] = \
                champions[champ][patch]['rylaiLiandry_count'] * \
                champions[champ][patch]['rylaiLiandry_totalTimeCrowdControlDealt']
            count_json[champ][patch]['nlr_count'] = champions[champ][patch]['nlr_count']
            count_json[champ][patch]['nlr_winner'] = \
                champions[champ][patch]['nlr_count'] * champions[champ][patch]['nlr_winner']
            count_json[champ][patch]['nlr_timestamp'] = \
                champions[champ][patch]['nlr_count'] * champions[champ][patch]['nlr_timestamp']
            count_json[champ][patch]['fiendish_count'] = champions[champ][patch]['fiendish_count']
            count_json[champ][patch]['fiendish_winner'] = \
                champions[champ][patch]['fiendish_count'] * champions[champ][patch]['fiendish_winner']
            count_json[champ][patch]['fiendish_timestamp'] = \
                champions[champ][patch]['fiendish_count'] * champions[champ][patch]['fiendish_timestamp']

            # Fill the showcase JSON
            showcase[champ][patch] = dict()
            showcase[champ][patch]['nashor_pickRate'] = champ_json['3115'][patch]['pickRate']
            showcase[champ][patch]['nashor_winner'] = champ_json['3115'][patch]['winner']
            showcase[champ][patch]['wota_pickRate'] = champ_json['3152'][patch]['pickRate']
            showcase[champ][patch]['wota_winner'] = champ_json['3152'][patch]['winner']
            showcase[champ][patch]['wota_totalHeal'] = champ_json['3152'][patch]['totalHeal']
            showcase[champ][patch]['rylaiLiandry_pickRate'] = champions[champ][patch]['rylaiLiandry_pickRate']
            showcase[champ][patch]['rylaiLiandry_winner'] = champions[champ][patch]['rylaiLiandry_winner']
            showcase[champ][patch]['rylaiLiandry_magicDamageDealtToChampions'] = \
                champions[champ][patch]['rylaiLiandry_magicDamageDealtToChampions']
            showcase[champ][patch]['rylaiLiandry_totalTimeCrowdControlDealt'] = \
                champions[champ][patch]['rylaiLiandry_totalTimeCrowdControlDealt']
            showcase[champ][patch]['nlr_pickRate'] = champions[champ][patch]['nlr_pickRate']
            showcase[champ][patch]['nlr_winner'] = champions[champ][patch]['nlr_winner']
            showcase[champ][patch]['nlr_timestamp'] = champions[champ][patch]['nlr_timestamp']
            showcase[champ][patch]['fiendish_pickRate'] = champions[champ][patch]['fiendish_pickRate']
            showcase[champ][patch]['fiendish_winner'] = champions[champ][patch]['fiendish_winner']
            showcase[champ][patch]['fiendish_timestamp'] = champions[champ][patch]['fiendish_timestamp']

    # Fill info in when no champion is selected
    showcase['summary'] = dict()
    for patch in patches:
        # Accumulate the counts
        count_json[patch] = dict()
        count_json[patch]['count'] = 0
        count_json[patch]['nashor_count'] = 0
        count_json[patch]['nashor_winner'] = 0
        count_json[patch]['nashor_champs'] = dict()
        count_json[patch]['wota_count'] = 0
        count_json[patch]['wota_winner'] = 0
        count_json[patch]['wota_totalHeal'] = 0
        count_json[patch]['wota_champs'] = dict()
        count_json[patch]['rylaiLiandry_count'] = 0
        count_json[patch]['rylaiLiandry_winner'] = 0
        count_json[patch]['rylaiLiandry_magicDamageDealtToChampions'] = 0
        count_json[patch]['rylaiLiandry_totalTimeCrowdControlDealt'] = 0
        count_json[patch]['rylaiLiandry_champs'] = dict()
        count_json[patch]['nlr_count'] = 0
        count_json[patch]['nlr_winner'] = 0
        count_json[patch]['nlr_timestamp'] = 0
        count_json[patch]['nlr_champs'] = dict()
        count_json[patch]['fiendish_count'] = 0
        count_json[patch]['fiendish_winner'] = 0
        count_json[patch]['fiendish_timestamp'] = 0
        count_json[patch]['fiendish_champs'] = dict()
        for champ in champs:
            count_json[patch]['count'] += count_json[champ][patch]['count']
            count_json[patch]['nashor_count'] += count_json[champ][patch]['nashor_count']
            count_json[patch]['nashor_winner'] += count_json[champ][patch]['nashor_winner']
            count_json[patch]['nashor_champs'][champ] = count_json[champ][patch]['nashor_winner']
            count_json[patch]['wota_count'] += count_json[champ][patch]['wota_count']
            count_json[patch]['wota_winner'] += count_json[champ][patch]['wota_winner']
            count_json[patch]['wota_totalHeal'] += count_json[champ][patch]['wota_totalHeal']
            count_json[patch]['wota_champs'][champ] = count_json[champ][patch]['wota_winner']
            count_json[patch]['rylaiLiandry_count'] += count_json[champ][patch]['rylaiLiandry_count']
            count_json[patch]['rylaiLiandry_winner'] += count_json[champ][patch]['rylaiLiandry_winner']
            count_json[patch]['rylaiLiandry_magicDamageDealtToChampions'] +=\
                count_json[champ][patch]['rylaiLiandry_magicDamageDealtToChampions']
            count_json[patch]['rylaiLiandry_totalTimeCrowdControlDealt'] += \
                count_json[champ][patch]['rylaiLiandry_totalTimeCrowdControlDealt']
            count_json[patch]['rylaiLiandry_champs'][champ] = count_json[champ][patch]['rylaiLiandry_winner']
            count_json[patch]['nlr_count'] += count_json[champ][patch]['nlr_count']
            count_json[patch]['nlr_winner'] += count_json[champ][patch]['nlr_winner']
            count_json[patch]['nlr_timestamp'] += count_json[champ][patch]['nlr_timestamp']
            count_json[patch]['nlr_champs'][champ] = count_json[champ][patch]['nlr_winner']
            count_json[patch]['fiendish_count'] += count_json[champ][patch]['fiendish_count']
            count_json[patch]['fiendish_winner'] += count_json[champ][patch]['fiendish_winner']
            count_json[patch]['fiendish_timestamp'] += count_json[champ][patch]['fiendish_timestamp']
            count_json[patch]['fiendish_champs'][champ] = count_json[champ][patch]['fiendish_winner']

        # Write out to showcase summary
        showcase['summary'][patch] = dict()
        showcase['summary'][patch]['nashor_pickRate'] = count_json[patch]['nashor_count'] / count_json[patch]['count']
        showcase['summary'][patch]['nashor_winner'] = \
            count_json[patch]['nashor_winner'] / count_json[patch]['nashor_count']
        showcase['summary'][patch]['nashor_champs'] = \
            sorted(count_json[patch]['nashor_champs'], key=count_json[patch]['nashor_champs'].get, reverse=True)[:5]
        showcase['summary'][patch]['wota_pickRate'] = count_json[patch]['wota_count'] / count_json[patch]['count']
        showcase['summary'][patch]['wota_winner'] = \
            count_json[patch]['wota_winner'] / count_json[patch]['wota_count']
        showcase['summary'][patch]['wota_totalHeal'] = \
            count_json[patch]['wota_totalHeal'] / count_json[patch]['wota_count']
        showcase['summary'][patch]['wota_champs'] = \
            sorted(count_json[patch]['wota_champs'], key=count_json[patch]['wota_champs'].get, reverse=True)[:5]
        showcase['summary'][patch]['rylaiLiandry_pickRate'] = \
            count_json[patch]['rylaiLiandry_count'] / count_json[patch]['count']
        showcase['summary'][patch]['rylaiLiandry_winner'] = \
            count_json[patch]['rylaiLiandry_winner'] / count_json[patch]['rylaiLiandry_count']
        showcase['summary'][patch]['rylaiLiandry_magicDamageDealtToChampions'] = \
            count_json[patch]['rylaiLiandry_magicDamageDealtToChampions'] / count_json[patch]['rylaiLiandry_count']
        showcase['summary'][patch]['rylaiLiandry_totalTimeCrowdControlDealt'] = \
            count_json[patch]['rylaiLiandry_totalTimeCrowdControlDealt'] / count_json[patch]['rylaiLiandry_count']
        showcase['summary'][patch]['rylaiLiandry_champs'] = \
            sorted(count_json[patch]['rylaiLiandry_champs'],
                   key=count_json[patch]['rylaiLiandry_champs'].get, reverse=True)[:5]
        showcase['summary'][patch]['nlr_pickRate'] = count_json[patch]['nlr_count'] / count_json[patch]['count']
        showcase['summary'][patch]['nlr_winner'] = count_json[patch]['nlr_winner'] / count_json[patch]['nlr_count']
        showcase['summary'][patch]['nlr_timestamp'] = \
            count_json[patch]['nlr_timestamp'] / count_json[patch]['nlr_count']
        showcase['summary'][patch]['nlr_champs'] = \
            sorted(count_json[patch]['nlr_champs'], key=count_json[patch]['nlr_champs'].get, reverse=True)[:5]
        showcase['summary'][patch]['fiendish_pickRate'] = \
            count_json[patch]['fiendish_count'] / count_json[patch]['count']
        showcase['summary'][patch]['fiendish_winner'] = \
            count_json[patch]['fiendish_winner'] / count_json[patch]['fiendish_count']
        showcase['summary'][patch]['fiendish_timestamp'] = \
            count_json[patch]['fiendish_timestamp'] / count_json[patch]['fiendish_count']
        showcase['summary'][patch]['fiendish_champs'] = \
            sorted(count_json[patch]['fiendish_champs'], key=count_json[patch]['fiendish_champs'].get, reverse=True)[:5]
    with open('../showcase.json', 'w') as f:
        json.dump(showcase, f)