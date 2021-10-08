import random


Map = {
	"A":["A","a","@"],
	"B":["b","B"],
	"C":["c","C","[","{"],
	"D":["d","D"],
	"E":["e","E"],
	"F":["f","F"],
	"G":["g","G"],
	"H":["#","h","H"],
	"I":["!","i","I","/","\\"],
	"J":["j","J"],
	"K":["k","K","|<"],
	"L":["l","L","|"],
	"M":["m","M"],
	"N":["n","N"],
	"O":["o","O","0","*"],
	"P":["p","P"],
	"Q":["Q","q"],
	"R":["r","R"],
	"S":["S","s","$","&"],
	"T":["t","T"],
	"U":["U","u"],
	"V":["v","V","^"],
	"W":["w","W"],
	"X":["x","X"],
	"Y":["y","Y"],
	"Z":["z","Z"]
}

def encode(Str):
	Str=Str.upper()
	n=len(Str)
	l=0
	enco=""
	while(l<n):
		if(l+1<n):
			if(Str[l]==Str[l+1]):
				
				enco+=random.choice(Map[Str[l]])+"2"
				l+=2
			else:
				
				enco+=random.choice(Map[Str[l]])
				l+=1
		else:
			
			enco+=random.choice(Map[Str[l]])
			l+=1
	return enco
print(encode("MANISH"))

def RandomString(N):
	randomString=""
	for i in range(N):
		randomString+=str(random.randint(0,10))

	start=random.randint(0,N-6)
	return randomString,randomString[start:start+6]

RS,OTP=RandomString(1023)
print(RS)
print(OTP)



def get_ranged_random_integer(rand_min, rand_max):
    import gmpy2
    rs = gmpy2.random_state(hash(gmpy2.random_state()))
    return rand_min + gmpy2.mpz_random(rs, rand_max - rand_min + 1)

def get_random_intger_of_N_digits(n):
    rand_min = 10**(n-1)
    rand_max = (10**n)-1
    return get_ranged_random_integer(rand_min, rand_max)
    

print(get_random_intger_of_N_digits(1023))