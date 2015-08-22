import json
from elasticsearch import Elasticsearch
from joblib import Parallel, delayed

ap_items = [3001, 3089, 3157, 3285, 3116, 3003, 3027, 3040, 3151, 3135, 3115, 3152,
            3165, 3174, 3504, 3060, 3100, 3025, 3146, 3023, 3092, 3124, 3041]


def read_json_file(p, m, r):
    print('Current file: ' + '_'.join([r, m, p]))
    with open('json/' + '_'.join([r, m, p]) + '.json', 'r') as f:
        for line in f:
            data = json.loads(line)
            relevant = dict()

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

            # Index in Elasticsearch
            es.index(index="ritoplzmyapitems", doc_type="patch" + p[2:], id=data['matchId'], body=relevant)

if __name__ == "__main__":
    patches = ['5.11', '5.14']
    match_types = ['NORMAL_5X5', 'RANKED_SOLO']
    regions = ['BR', 'EUNE', 'EUW', 'KR', 'LAN', 'LAS', 'NA', 'OCE', 'RU', 'TR']

    es = Elasticsearch()

    for patch in patches:
        for match in match_types:
            Parallel(n_jobs=8)(delayed(read_json_file)(patch, match, region) for region in regions)