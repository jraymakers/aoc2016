immutable Pos
  x::Integer
  y::Integer
end

getnum(x,y) = x*x + 3*x + 2*x*y + y + y*y + 1358
wall(pos) = isodd(count_ones(getnum(pos.x,pos.y)))

function visit(pos, stepsSoFar, visited, queue)
  if pos.x >= 0 && pos.y >= 0
    if !haskey(visited, pos)
      if !wall(pos)
        visited[pos] = stepsSoFar + 1
        push!(queue, pos)
      end
    end
  end
end

function solve(start, target)
  visited = Dict(start => 0)
  queue = [start]
  while (length(queue) > 0)
    pos = shift!(queue)
    stepsSoFar = visited[pos]
    if pos.x == target.x && pos.y == target.y
      return stepsSoFar
    end
    visit(Pos(pos.x, pos.y+1), stepsSoFar, visited, queue)
    visit(Pos(pos.x, pos.y-1), stepsSoFar, visited, queue)
    visit(Pos(pos.x+1, pos.y), stepsSoFar, visited, queue)
    visit(Pos(pos.x-1, pos.y), stepsSoFar, visited, queue)
  end
end

println(solve(Pos(1,1), Pos(31,39)))
