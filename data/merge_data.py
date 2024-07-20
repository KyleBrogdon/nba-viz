import pandas as pd

bpm = pd.read_excel('data/bpm.xlsx')
players = pd.read_excel('data/players.xlsx')
teams = pd.read_excel('data/teams.xlsx')

merged_players = pd.merge(players, bpm[['player', 'BPM']], on='player')

merged_players.to_csv('data/merged_players_bpm.csv', index=False)

teams.to_csv('data/teams.csv', index=False)
