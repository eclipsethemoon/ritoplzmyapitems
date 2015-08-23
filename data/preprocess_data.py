import json
from elasticsearch import Elasticsearch
from joblib import Parallel, delayed

ap_items = [1026, 1052, 1058, 3001, 3003, 3023, 3025, 3027, 3040, 3041, 3057, 3060, 3078, 3089, 3100, 3108,
            3113, 3115, 3116, 3124, 3135, 3136, 3145, 3146, 3151, 3152, 3157, 3165, 3174, 3191, 3285, 3504]
champs = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30,
          31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 48, 50, 51, 53, 54, 55, 56, 57, 58, 59, 60, 61,
          62, 63, 64, 67, 68, 69, 72, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 89, 90, 91, 92, 96, 98, 99,
          101, 102, 103, 104, 105, 106, 107, 110, 111, 112, 113, 114, 115, 117, 119, 120, 121, 122, 126, 127, 131, 133,
          134, 143, 150, 154, 157, 161, 201, 222, 223, 236, 238, 245, 254, 266, 267, 268, 412, 421, 429, 432]
lanes = ["MID", "MIDDLE", "TOP", "JUNGLE", "BOT", "BOTTOM"]
roles = ["DUO", "NONE", "SOLO", "DUO_CARRY", "DUO_SUPPORT"]
spells = [1, 2, 3, 4, 6, 7, 11, 12, 13, 14, 21]
tiers = ["CHALLENGER", "MASTER", "DIAMOND", "PLATINUM", "GOLD", "SILVER", "BRONZE", "UNRANKED"]


def initialize_relevant_items():
    relevant_items = dict()
    for item in ap_items:
        relevant_items[item] = dict()
        relevant_items[item]['count'] = 0
        for champ in champs:
            relevant_items[item][champ] = dict()
            relevant_items[item][champ]['count'] = 0
            relevant_items[item][champ]['winner'] = 0
            relevant_items[item][champ]['magicDamageDealt'] = 0
            relevant_items[item][champ]['magicDamageDealtToChampions'] = 0
            relevant_items[item][champ]['totalTimeCrowdControlDealt'] = 0
            relevant_items[item][champ]['kills'] = 0
            relevant_items[item][champ]['deaths'] = 0
            relevant_items[item][champ]['assists'] = 0
            relevant_items[item][champ]['timestamp'] = 0
            for tier in tiers:
                relevant_items[item][champ][tier] = 0
            for lane in lanes:
                relevant_items[item][champ][lane] = 0
            for role in roles:
                relevant_items[item][champ][role] = 0
            relevant_items[item][champ]['spell'] = dict()
            for spell in spells:
                relevant_items[item][champ]['spell'][spell] = 0
    return relevant_items


def read_json_file(p, m, r):
    print('Current file: ' + '_'.join([r, m, p]))
    with open('json/' + '_'.join([r, m, p]) + '.json', 'r') as f:
        relevant_items = initialize_relevant_items()      # Item-centric data
        relevant_champs = {champ: 0 for champ in champs}  # Champion counts (may not be needed)
        for line in f:
            data = json.loads(line)
            relevant = dict()        # General storage of data, not sure if to be used

            # Grab the summary info about the match
            relevant['matchDuration'] = data['matchDuration']
            relevant['matchId'] = data['matchId']
            relevant['matchVersion'] = data['matchVersion']
            relevant['queueType'] = data['queueType']
            relevant['region'] = data['region']
            relevant['participants'] = list()

            # Create a list of events pertaining to the purchase of relevant AP items
            frames = data['timeline']['frames']
            ap_purchases = list()
            for frame in frames:
                if 'events' in frame:
                    events = frame['events']
                    purchase_events = filter(lambda event: event['eventType'] == 'ITEM_PURCHASED', events)
                    ap_event = filter(lambda event: event['itemId'] in ap_items, purchase_events)
                    if ap_event:
                        ap_purchases.extend(ap_event)

            # Get the participant info if they have any relevant AP item
            participants = set([x['participantId'] for x in ap_purchases])
            for participant in participants:
                participant_data = data['participants'][participant - 1]
                player = dict()
                player['championId'] = participant_data['championId']
                player['highestAchievedSeasonTier'] = participant_data['highestAchievedSeasonTier']
                player['participantId'] = participant_data['participantId']
                player['spell1Id'] = participant_data['spell1Id']
                player['spell2Id'] = participant_data['spell2Id']
                player['teamId'] = participant_data['teamId']
                player['lane'] = participant_data['timeline']['lane']
                player['role'] = participant_data['timeline']['role']
                player['kills'] = participant_data['stats']['kills']
                player['deaths'] = participant_data['stats']['deaths']
                player['assists'] = participant_data['stats']['assists']
                player['magicDamageDealt'] = participant_data['stats']['magicDamageDealt']
                player['magicDamageDealtToChampions'] = participant_data['stats']['magicDamageDealtToChampions']
                player['totalTimeCrowdControlDealt'] = participant_data['stats']['totalTimeCrowdControlDealt']
                player['items'] = [ap_purchase['itemId'] for ap_purchase in ap_purchases
                                   if ap_purchase['participantId'] == participant]
                player['timestamps'] = [ap_purchase['timestamp'] for ap_purchase in ap_purchases
                                        if ap_purchase['participantId'] == participant]
                player['winner'] = participant_data['stats']['winner']
                relevant['participants'].append(player)

                # Accumulate data into relevant dictionarys for items, champions, and builds
                # Note: We only care about the first time of an item (e.g. no 6 deathcap build)
                items = []
                relevant_champs[player['championId']] += 1
                for idx, item in enumerate(player['items']):
                    if item not in items:
                        items.append(item)
                        champion = player['championId']
                        relevant_items[item]['count'] += 1
                        relevant_items[item][champion]['count'] += 1
                        if player['winner']:
                            relevant_items[item][champion]['winner'] += 1
                        relevant_items[item][champion][player['highestAchievedSeasonTier']] += 1
                        relevant_items[item][champion][player['lane']] += 1
                        relevant_items[item][champion][player['role']] += 1
                        relevant_items[item][champion]['spell'][player['spell1Id']] += 1
                        relevant_items[item][champion]['spell'][player['spell2Id']] += 1
                        relevant_items[item][champion]['magicDamageDealt'] += player['magicDamageDealt']
                        relevant_items[item][champion]['magicDamageDealtToChampions'] += \
                            player['magicDamageDealtToChampions']
                        relevant_items[item][champion]['totalTimeCrowdControlDealt'] += \
                            player['totalTimeCrowdControlDealt']
                        relevant_items[item][champion]['kills'] += player['kills']
                        relevant_items[item][champion]['deaths'] += player['deaths']
                        relevant_items[item][champion]['assists'] += player['assists']
                        relevant_items[item][champion]['timestamp'] += player['timestamps'][idx]

            # Index in Elasticsearch
            es.index(index="ritoplzmyapitems", doc_type="patch" + p[2:], id=data['matchId'],
                     body=relevant, request_timeout=60)
        with open('json/items/' + '_'.join([r, m, p]) + '.json', 'w') as item_file:
            json.dump(relevant_items, item_file)
        with open('json/champs/' + '_'.join([r, m, p]) + '.json', 'w') as champ_file:
            json.dump(relevant_champs, champ_file)


if __name__ == "__main__":
    patches = ['5.11', '5.14']
    match_types = ['NORMAL_5X5', 'RANKED_SOLO']
    regions = ['BR', 'EUNE', 'EUW', 'KR', 'LAN', 'LAS', 'NA', 'OCE', 'RU', 'TR']

    es = Elasticsearch()

    for patch in patches:
        for match in match_types:
            # Set n_jobs to the number of cores on the system
            Parallel(n_jobs=8)(delayed(read_json_file)(patch, match, region) for region in regions)