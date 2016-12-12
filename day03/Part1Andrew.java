import java.io.File;
import java.io.FileNotFoundException;
import java.util.Arrays;
import java.util.Scanner;

public class Part1Andrew {
    
    public static void main(String[] args) throws FileNotFoundException {
        Scanner lineScanner = new Scanner(new File(args[0]));
        filterTriangles(lineScanner);
        lineScanner.close();
    }

    public static void filterTriangles(Scanner scanner) {
        int validTriangles = 0;
        while (scanner.hasNextLine()) {
            String line = scanner.nextLine();
            int[] sideLengths = new int[3];
            Scanner sideScanner = new Scanner(line);
            for (int i = 0; i < sideLengths.length; i++) {
                sideLengths[i] = sideScanner.nextInt();
            }

            if (isTriangle(sideLengths)) {
                validTriangles++;
            }
        }

        System.out.println(validTriangles);
    }

    public static boolean isTriangle(int[] sideLengths) {
        int[] sorted = Arrays.copyOf(sideLengths, sideLengths.length);
        Arrays.sort(sorted);
        assert(sorted.length == 3);
        return sorted[0] + sorted[1] > sorted[2];
    }
}