function dragon(input::BitVector)::BitVector
  x = reverse(input)
  flipbits!(x)
  return vcat(input, false, x)
end

function dragonto(input::BitVector, desiredlength::Integer)::BitVector
  data = input
  while length(data) < desiredlength
    data = dragon(data)
  end
  return data[1:desiredlength]
end

function checksum(input::BitVector)::BitVector
  result = falses(length(input)>>1)
  for i in 1:length(result)
    result[i] = input[i*2-1] == input[i*2]
  end
  return result
end

function string2bitvector(input::String)
  return BitVector(map(c -> c == "1", split(input, "")))
end

function bitvector2string(input::BitVector)
  return join(map(d -> d ? "1" : "0", Array(input)))
end

function shortenedchecksum(input::String, disklength::Integer)::String
  bv = string2bitvector(input)
  dragoned = dragonto(bv, disklength)
  println("dragoned len: $(length(dragoned))")
  result = checksum(dragoned)
  println("checksum len: $(length(result))")
  while iseven(length(result))
    result = checksum(result)
    println("checksum len: $(length(result))")
  end
  return bitvector2string(result)
end

# println(shortenedchecksum("10000", 20))
# println(shortenedchecksum("00101000101111010", 272))
println(shortenedchecksum("00101000101111010", 35651584))
