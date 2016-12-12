import java.io.File;
import java.io.FileNotFoundException;
import java.util.Arrays;
import java.util.Scanner;

public class Part2Andrew {
    
    public static void main(String[] args) throws FileNotFoundException {
        Scanner lineScanner = new Scanner(new File(args[0]));
        filterTriangles(lineScanner);
        lineScanner.close();
    }

    public static void filterTriangles(Scanner scanner) {
        int validTriangles = 0;
        while (scanner.hasNextLine()) {
            int[][] triangles = getTriangles(scanner, 3);
            for (int[] sideLengths : triangles) {

                if (isTriangle(sideLengths)) {
                    validTriangles++;
                }
            }
        }

        System.out.println(validTriangles);
    }

    public static int[][] getTriangles(Scanner scanner, int numTriangles) {
        int[][] triangles = new int[numTriangles][3];
        for (int i = 0; i < 3; i++) {
            String line = scanner.nextLine();
            Scanner tokens = new Scanner(line);
            for (int triangleIndex = 0; triangleIndex < numTriangles; triangleIndex++) {
                triangles[triangleIndex][i] = tokens.nextInt();
            }
        }
        return triangles;
    }

    public static boolean isTriangle(int[] sideLengths) {
        int[] sorted = Arrays.copyOf(sideLengths, sideLengths.length);
        Arrays.sort(sorted);
        assert(sorted.length == 3);
        return sorted[0] + sorted[1] > sorted[2];
    }
}