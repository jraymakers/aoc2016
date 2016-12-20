puzzleInput = '10011111011011001'

stringInvert = { '1': '0', '0': '1' }

def generateDataStep(input):
    reversed = input[::-1]
    inputB = ''
    for char in reversed:
        inputB += stringInvert[char]
    return input + '0' + inputB

def generateData(input, size):
    generated = input
    while True:
        generated = generateDataStep(generated)
        if len(generated) >= size:
            break

    return generated[:size]


stringChecksum = { '00': '1', '01': '0', '10': '0', '11': '1' }

def checksumStep(string):
    checksum = ''
    for i in range(0, len(string), 2):
        pair = string[i:i+2]
        checksum += stringChecksum[pair]

    return checksum


def checksum(string):
    checksum = string
    while True:
        checksum = checksumStep(checksum)
        if len(checksum) % 2 == 1:
            break

    return checksum


diskData = generateData(puzzleInput, 35651584)
diskChecksum = checksum(diskData)
print diskChecksum
