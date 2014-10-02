import csv
import json

def loadCSV(readPath):
    with open(readPath, "rU") as readFile:
        reader = csv.reader(readFile)
        next(reader, None)
        activityList = []
        for row in reader:
            if row[1]:
                activity = {}
                activity['name'] = row[1]
                activity['type'] = row[2]
                if activity['type'] == "Do Something":
                    activity['type'] = "DoSomething"
                if activity['type'] == "Food/Drink":
                    activity['type'] = "FoodDrink"
                activity['district'] = row[0]
                activity['picture_path'] = row[3]
                if row[4]:
                    activity['photo_credit'] = row[4]
                if row[5] == "0":
                    activity['cost'] = "free"
                else:
                    activity['cost'] = row[5]
                activity['routes'] = []
                activity['routes'].append(numToName(row[6]))
                if row[7]:
                    activity['routes'].append(numToName(row[7]))
                if row[8]:
                    activity['routes'].append(numToName(row[8]))
                if row[9]:
                    activity['routes'].append(numToName(row[9]))
                activity['route_notes'] = row[10]
                activity['lat'] = row[11]
                activity['lng'] = row[12]
                if row[13]:
                    activity['link'] = row[13]
                activity['description'] = row[14]
                activityList.append(activity)
        return json.dumps(activityList, encoding='latin1')

def numToName(num):
    if num == "1":
        return "Big Blue Bus 1"
    elif num == "12":
        return "Big Blue Bus 12"
    elif num == "2":
        return "Big Blue Bus 2"
    elif num == "3":
        return "Big Blue Bus 3"
    elif num == "6":
        return "Culver City 6"
    elif num == "20":
        return "Metro 20"
    elif num == "2/302":
        return "Metro 2/302"
    elif num == "534":
        return "Metro 534"
    elif num == "720":
        return "Metro 720"
    elif num == "761":
        return "Metro 761"
    elif num == "806":
        return "Metro Expo 806"
    else:
        return num

print loadCSV('raw_data.csv')