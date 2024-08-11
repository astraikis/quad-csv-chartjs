import csv
import os
import random

NUM_RESTAURANTS = 100

fieldnames = ["name", "price", "rating", "num_reviews"]
restaurants = []

os.remove("./test-data/restaurants.csv")

with open("./test-data/restaurants.csv", "w") as f:
    # Generate restaurants
    for i in range(NUM_RESTAURANTS):
        restaurant = {}
        restaurant["name"] = "Pizza #" + str(i)
        restaurant["price"] = round(random.uniform(7.5, 17), 2)
        restaurant["rating"] = round(random.uniform(2, 5), 2)
        restaurant["num_reviews"] = random.randint(5, 100)
        restaurants.append(restaurant)

    # Write to CSV
    writer = csv.DictWriter(f, fieldnames=fieldnames)
    writer.writeheader()
    writer.writerows(restaurants)
