import sys
import json
import numpy as np

def read_in():
    lines = sys.stdin.readlines()
    return json.loads(lines[0])

def main():
    print(np.random.normal())

if __name__ == "__main__":
    main()