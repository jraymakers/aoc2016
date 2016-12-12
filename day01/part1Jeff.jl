function readFile(filename)
  open(filename) do f
    return readstring(f)
  end
end

function calcDist(instructions)
  dir = 0 # 0 = N, 1 = E, 2 = S, 3 = W
  x = 0
  y = 0
  for ins in instructions
    m = match(r"(L|R)(\d+)", ins)
    insdir = m.captures[1]
    insdist = parse(Int32, m.captures[2])
    dir = (dir + (insdir == "L" ? 3 : 1)) % 4
    if dir == 0
      y += insdist
    elseif dir == 1
      x += insdist
    elseif dir == 2
      y -= insdist
    elseif dir == 3
      x -= insdist
    end
  end
  return abs(x) + abs(y)
end

function solve()
  instructions = split(strip(readFile("inputJeff.txt")), ", ")
  println(calcDist(instructions))
end

solve()
