import random

def step(data):
    """
    Dummy function to update the value of a dict with random data.
    """
    data.update({'ping': random.random()})
    return data