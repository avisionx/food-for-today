import sys
import csv
import json


def csv_to_json(csv_file_path):
    with open(csv_file_path, "r") as csv_file:
        csv_data = csv.DictReader(csv_file)
        data = [row for row in csv_data]
    return data


def clean_item_data(raw_data):
    clean_data = []
    for x in raw_data:
        heading, categories, items = x.values()
        clean_item = {
            "heading": heading.strip().lower(),
            "categories": [cat.strip().lower() for cat in categories.split(",")],
            "items": [item.strip().lower() for item in items.split(",")],
        }
        clean_data.append(clean_item)
    return clean_data


def generate_category_data(cleaned_data):
    _data = {}
    for x in cleaned_data:
        heading, _categories, _items = x.values()
        if _items and _items != [""]:
            for cat in _categories:
                _data.setdefault(cat, []).append({"heading": heading, "items": _items})
    return _data


def save_json(data, file_path):
    with open(file_path, "w+") as json_file:
        json.dump(data, json_file, indent=4)


raw_data = csv_to_json(f"datasets/{sys.argv[1]}.csv")
clean_data = clean_item_data(raw_data)
data = generate_category_data(clean_data)
save_json(data, f"../src/data/{sys.argv[1]}.json")
