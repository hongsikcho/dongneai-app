import { Link, type Href } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { Screen } from '@/components/Screen';
import { colors } from '@/theme/colors';

interface Props {
  /** 화면 정의서의 화면 ID (예: FEED-02) */
  screenId: string;
  title: string;
  /** 화면 정의서의 주요 구성 */
  description: string;
  links?: { label: string; href: Href }[];
}

/** 아직 구현하지 않은 화면. 화면 정의서 내용을 그대로 보여준다. */
export function Placeholder({ screenId, title, description, links = [] }: Props) {
  return (
    <Screen scroll>
      <View style={styles.card}>
        <Text style={styles.id}>{screenId}</Text>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>
      </View>
      {links.map((link) => (
        <Link key={link.label} href={link.href} style={styles.link}>
          {link.label}
        </Link>
      ))}
    </Screen>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: colors.surface, borderRadius: 14, padding: 16, gap: 6 },
  id: { fontSize: 12, fontWeight: '700', color: colors.primaryDark },
  title: { fontSize: 18, fontWeight: '700', color: colors.text },
  description: { fontSize: 14, lineHeight: 21, color: colors.textSub },
  link: { fontSize: 15, color: colors.primary, paddingVertical: 10 },
});
